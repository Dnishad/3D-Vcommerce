/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

THREE.DeviceOrientationControls = function ( object ) {

	var scope = this;

	this.object = object;
	this.object.rotation.reorder( 'YXZ' );

	this.enabled = true;

	this.deviceOrientation = {};
	this.screenOrientation = 0;

	this.alphaOffset = 0; // radians
    
    
    var mouseFlags = {
		MOUSEDOWN: 0,
		MOUSEMOVE: 1
	};

	var flag;
	var isDragging = false;
	var previousMousePosition = {
		x: 0,
		y: 0
	};
    var touchStartX = 0;
    var camRotationOffset = 0;
    var globalOffset = 0;
    var camRotationOffsetTouch = 0;

	var onDeviceOrientationChangeEvent = function ( event ) {

		scope.deviceOrientation = event;

	};

	var onScreenOrientationChangeEvent = function () {

		scope.screenOrientation = window.orientation || 0;

	};

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

	var setObjectQuaternion = function () {

		var zee = new THREE.Vector3( 0, 0, 1 );

		var euler = new THREE.Euler();

		var q0 = new THREE.Quaternion();

		var q1 = new THREE.Quaternion( - Math.sqrt( 0.5 ), 0, 0, Math.sqrt( 0.5 ) ); // - PI/2 around the x-axis
        
        var offsetQuaternion = new THREE.Quaternion();
        
        //offsetQuaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );

		return function ( quaternion, alpha, beta, gamma, orient ) {

			euler.set( beta , alpha, - gamma, 'YXZ' ); // 'ZXY' for the device, but 'YXZ' for us

			quaternion.setFromEuler( euler ); // orient the device

			quaternion.multiply( q1 ); // camera looks out the back of the device, not the top

			quaternion.multiply( q0.setFromAxisAngle( zee, - orient ) ); // adjust for screen orientation
            
            //offsetQuaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), camRotationOffset );
            
            //quaternion.multiply(offsetQuaternion);

		};

	}();
    
    var Quat2Angle = function ( x, y, z, w ) {

        var pitch, roll, yaw;

        var test = x * y + z * w;
        if (test > 0.499) { // singularity at north pole
            yaw = 2 * Math.atan2(x, w);
            pitch = Math.PI / 2;
            roll = 0;

            var euler = new THREE.Vector3( pitch, roll, yaw);
            return euler;
        }
        if (test < -0.499) { // singularity at south pole
            yaw = -2 * Math.atan2(x, w);
            pitch = -Math.PI / 2;
            roll = 0;
            var euler = new THREE.Vector3( pitch, roll, yaw);
            return euler;
        }
        var sqx = x * x;
        var sqy = y * y;
        var sqz = z * z;
        yaw = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz);
        pitch = Math.asin(2 * test);
        roll = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz);

        var euler = new THREE.Vector3( pitch, roll, yaw);
        return euler;
    }();

	this.connect = function () {

		onScreenOrientationChangeEvent(); // run once on load

		window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );
        
        window.addEventListener('mousedown', mouseDownObj, false);
	   window.addEventListener('mousemove', mouseMoveObj, false);
	   window.addEventListener('mouseup', mouseUpObj, false);
        
        window.addEventListener('touchstart', onTouchStartObj, false);
	   window.addEventListener('touchmove', onTouchMoveObj, false);
	   window.addEventListener('touchend', onTouchEndObj, false);

		scope.enabled = true;

	};

	this.disconnect = function () {

		window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
		window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

        window.removeEventListener('mousedown', mouseDownObj, false);
	    window.removeEventListener('mousemove', mouseMoveObj, false);
	    window.removeEventListener('mouseup', mouseUpObj, false);
        
        window.removeEventListener('touchstart', onTouchStartObj, false);
	   window.removeEventListener('touchmove', onTouchMoveObj, false);
	   window.removeEventListener('touchend', onTouchEndObj, false);
        
		scope.enabled = false;

	};

	this.update = function () {

		if ( scope.enabled === false ) return;

		var device = scope.deviceOrientation;
        
		if ( device ) {
            //console.log(device.alpha);
			var alpha = device.alpha ? THREE.Math.degToRad( device.alpha ) + scope.alphaOffset : 0; // Z

			var beta = device.beta ? THREE.Math.degToRad( device.beta) : Math.PI / 2; // X'

			var gamma = device.gamma ? THREE.Math.degToRad( device.gamma ) : 0; // Y''

			var orient = scope.screenOrientation ? THREE.Math.degToRad( scope.screenOrientation ) : 0; // O

			setObjectQuaternion( scope.object.quaternion, alpha, beta, gamma, orient );
            
            if(isDragging)
                scope.object.rotateOnWorldAxis( new THREE.Vector3( 0, 1, 0 ), globalOffset + camRotationOffset);
            else
                scope.object.rotateOnWorldAxis( new THREE.Vector3( 0, 1, 0 ), globalOffset);
            
            // console.log(camRotationOffset);
		}


	};

	this.dispose = function () {

		scope.disconnect();

	};

    function mouseDownObj(e) {
		if(scope.enabled == false)
			return ;
			isDragging = true;
			flag = mouseFlags.MOUSEDOWN;
	}
    
    function mouseMoveObj(e) {
		if(scope.enabled == false)
			return ;
		var deltaMove = {
			x: e.offsetX - previousMousePosition.x,
			y: e.offsetY - previousMousePosition.y
		};

		if (isDragging) {
			if (deltaMove.x != 0) {
				camRotationOffset += deltaMove.x / 200;
              //   console.log(camRotationOffset);
				flag = mouseFlags.MOUSEMOVE;
				// $('html,body').css('cursor', 'grabbing');
			}
		}

		previousMousePosition = {
			x: e.offsetX,
			y: e.offsetY
		};
	}

	function mouseUpObj(e) {
		if(scope.enabled == false)
			return ;
		isDragging = false;

		// $('html,body').css('cursor', 'grab');
	}
    
    
    function onTouchStartObj(e) {
		if(scope.enabled == false)
			return ;
        if(e.touches.length != 1)
           return ;
        
        camRotationOffset = 0;
        touchStartX = e.touches[0].pageX;
        //camRotationOffset = touchStartX;
        // console.log("camRotationOffset start : " + camRotationOffset);
			isDragging = true;
			flag = mouseFlags.MOUSEDOWN;
	}
    
    function onTouchMoveObj(e) {
		if(scope.enabled == false)
			return ;
        if(e.touches.length != 1)
            return ;
        
		var deltaMove = {
			x: e.touches[0].pageX - touchStartX,
			y: e.touches[0].pageY - previousMousePosition.y
		};

		if (isDragging) {
			if (deltaMove.x != 0) {
				camRotationOffset = (deltaMove.x / 400);
                console.log(deltaMove.x);
				flag = mouseFlags.MOUSEMOVE;
				//$('html,body').css('cursor', 'grabbing');
			}
		}

		previousMousePosition = {
			x: e.touches[0].pageX,
			y: e.touches[0].pageY
		};
	}

	function onTouchEndObj(e) {
		if(scope.enabled == false)
			return ;
        
        globalOffset += camRotationOffset;
        console.log("camRotationOffset end : " + camRotationOffset);
		isDragging = false;
        //console.log(touchStartX);
		//$('html,body').css('cursor', 'grab');
	}
    
	this.connect();

};