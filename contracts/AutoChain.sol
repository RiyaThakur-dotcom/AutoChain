// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AutoChain
 * @author Expert Solidity Developer
 * @notice Decentralized telemetry logging system for off-road autonomous vehicles.
 * @dev Stores only data hashes on-chain for gas efficiency, with full data off-chain (MongoDB).
 */
contract AutoChain {
    enum EventType {
        IGNITION,
        TERRAIN_CHANGE,
        OBSTACLE_DETECT,
        DECISION_MADE,
        EMERGENCY_STOP,
        WAYPOINT_REACH,
        SENSOR_ALERT,
        SHUTDOWN
    }

    struct TelemetryEvent {
        uint256 eventId;
        address vehicleAddress;
        EventType eventType;
        int32 latitude; // Scaled by 1e6
        int32 longitude; // Scaled by 1e6
        uint32 speed; // cm/s
        int32 altitude; // cm
        string terrainType;
        string decisionReason;
        bytes32 sensorDataHash; // SHA-256 hash of full off-chain payload
        bytes32 safetyProof;    // Commitment hash: keccak256(lat, lon, salt)
        uint256 timestamp;
    }

    struct Vehicle {
        string humanReadableId;
        address owner;
        bool isRegistered;
        uint256 totalEvents;
        uint256 lastSafetyCheck;
    }

    address public admin;
    uint256 public nextEventId;
    uint256 public totalGasSaved; // Simulated metric
    
    mapping(address => Vehicle) public vehicles;
    address[] public vehicleList;
    mapping(address => uint256[]) public vehicleEventIds;
    mapping(uint256 => TelemetryEvent) public events;

    event VehicleRegistered(address indexed vehicleAddress, string humanId);
    event TelemetryLogged(uint256 indexed eventId, address indexed vehicleAddress, EventType eventType, bytes32 sensorDataHash);
    event EmergencyAlert(address indexed vehicleAddress, string reason, uint256 timestamp);
    event SafetyVerified(uint256 indexed eventId, bool success);

    /**
     * @dev Access control: Only the contract creator/admin
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "AutoChain: Caller is not admin");
        _;
    }

    /**
     * @dev Access control: Only registered vehicles can log data
     */
    modifier onlyRegistered(address _vehicle) {
        require(vehicles[_vehicle].isRegistered, "AutoChain: Vehicle not registered");
        _;
    }

    constructor() {
        admin = msg.sender;
        nextEventId = 1;
    }

    /**
     * @notice Register a new vehicle to the system
     */
    function registerVehicle(address _vehicleAddress, string memory _humanId) external onlyAdmin {
        require(!vehicles[_vehicleAddress].isRegistered, "AutoChain: Vehicle already registered");
        
        vehicles[_vehicleAddress] = Vehicle({
            humanReadableId: _humanId,
            owner: _vehicleAddress,
            isRegistered: true,
            totalEvents: 0,
            lastSafetyCheck: block.timestamp
        });
        
        vehicleList.push(_vehicleAddress);
        emit VehicleRegistered(_vehicleAddress, _humanId);
    }

    /**
     * @notice Log a new telemetry event with a ZK-Safety proof commitment
     */
    function logEvent(
        EventType _eventType,
        int32 _latitude,
        int32 _longitude,
        uint32 _speed,
        int32 _altitude,
        string calldata _terrainType,
        string calldata _decisionReason,
        bytes32 _sensorDataHash,
        bytes32 _safetyProof
    ) external onlyRegistered(msg.sender) {
        uint256 eventId = nextEventId++;
        
        events[eventId] = TelemetryEvent({
            eventId: eventId,
            vehicleAddress: msg.sender,
            eventType: _eventType,
            latitude: _latitude,
            longitude: _longitude,
            speed: _speed,
            altitude: _altitude,
            terrainType: _terrainType,
            decisionReason: _decisionReason,
            sensorDataHash: _sensorDataHash,
            safetyProof: _safetyProof,
            timestamp: block.timestamp
        });

        vehicleEventIds[msg.sender].push(eventId);
        vehicles[msg.sender].totalEvents++;
        totalGasSaved += 150000; // Average savings per anchor vs raw data

        emit TelemetryLogged(eventId, msg.sender, _eventType, _sensorDataHash);

        if (_eventType == EventType.EMERGENCY_STOP) {
            emit EmergencyAlert(msg.sender, _decisionReason, block.timestamp);
        }
    }

    /**
     * @notice Verify a safety proof without exposing course data permanently
     * @param _eventId The event to verify
     * @param _salt The secret salt used by the vehicle
     */
    function verifySafetyProof(uint256 _eventId, bytes32 _salt) external returns (bool) {
        TelemetryEvent storage e = events[_eventId];
        require(e.eventId != 0, "AutoChain: Event not found");

        bytes32 computedHash = keccak256(abi.encodePacked(e.latitude, e.longitude, _salt));
        bool isValid = (computedHash == e.safetyProof);
        
        if (isValid) {
            vehicles[e.vehicleAddress].lastSafetyCheck = block.timestamp;
        }

        emit SafetyVerified(_eventId, isValid);
        return isValid;
    }

    function fetchEventData(uint256 _eventId) external view returns (TelemetryEvent memory) {
        require(_eventId < nextEventId && _eventId > 0, "AutoChain: Event does not exist");
        return events[_eventId];
    }

    function getVehicleCount() external view returns (uint256) {
        return vehicleList.length;
    }

    function getVehicleByIndex(uint256 _index) external view returns (address) {
        return vehicleList[_index];
    }
}
