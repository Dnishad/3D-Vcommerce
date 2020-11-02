THREE.CameraMovement = function (camera, domElement, Objcontrol, outlinePass, scene, videoTextureCD1, videoTextureCD2, videoTextureCD3)
{
	this.camera = camera;
	this.domElement = (domElement !== undefined) ? domElement : document;
	this.Objcontrol = Objcontrol;
	this.outlinePass = outlinePass;
	this.scene = scene;
	this.videoTextureCD1 = videoTextureCD1;
	this.videoTextureCD2 = videoTextureCD2;
	this.videoTextureCD3 = videoTextureCD3;
	var mouseFlags =
	{
		MOUSEDOWN: 0,
		MOUSEMOVE: 1
	};

	var objectList =
	{
		FloorObj: 0,
		PurseObj: 1,
		CameraObj: 2,
		TableObj: 3,
		SofaObj: 4,
		SofaChair01Obj: 5,
		SofaChair02Obj: 6,
		LogoObj: 7,
		TvObj: 8,
		CelingLampObj: 9,
		GirlObj: 10,
		None: 11
	};
	var currentObj = objectList.None;
	var flag;
	var isClick = false;
	var rotatespeed = 0.005;

	var isObject = false;

	var timer = 0;
	var orbit;
	var IsCamera = false;
	var IsPurse = false;
	var IsCoat = false;
	var IsCelingLamp = false;
	var IsLogo = false;
	var IsTable = false;
	var IsTv = false;
	var ISSofa = false;
	var IsSofaChair1 = false;
	var IsSofaChair2 = false;
	var IsShoes = false;

	var currentTouches = [];

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();
	var temppos = new THREE.Vector3();
	var sphericalDelta = new THREE.Spherical();
	/******************* Interaction Controls (rotate & zoom, desktop & mobile) - Start ************/
	// MOUSE - move
	this.domElement.addEventListener('mousedown', mouseDown, false);
	this.domElement.addEventListener('mousemove', mouseMove, false);
	this.domElement.addEventListener('mouseup', mouseUp, false);
	this.domElement.addEventListener('dblclick', dblclick, false);
	requestAnimationFrame(animate);
	// MOUSE - zoom
	//this.domElement.addEventListener('wheel', wheel, false);
	HideContent();


	//$('html,body').css('cursor', 'grab');
	var round1,
	round2,
	round3,
	round4;
	var curinterset;
	var selectedround;
	var rotationSpeed = 0.08;
	var isRoundRotation = false;
	var rotateSphere;

	var purseId = 1;
	var tableId = 1;
	var sofaChair02Id = 1;
	var sofaChair01Id = 1;
	var sofaId = 1;
	var lampId = 1;
	var coatId = 1;
	SphereLoad();
	BtnTextureLoad();
	mdlTextureLoad();

	$("#sceneclose").click(function(){
		BoolSet();
		orbit.autoRotate = false;
		orbit.enableZoom = true;
		$("#sceneclose").css("display","none");
					
		});

	function mouseDown(event)
	{
		if (isClick == false)
			return;
		event.preventDefault();

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y =  - (event.clientY / window.innerHeight) * 2 + 1;
		SphereClick();
		isClick = false;

	}
	function mouseMove(event)
	{
		isClick = false;
		try
		{
			event.preventDefault();
		}
		catch (ev)
		{}
		
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y =  - (event.clientY / window.innerHeight) * 2 + 1;
		ObjectOutline();
		isClick = true;
		flag = mouseFlags.MOUSEMOVE;
		

	}

	function dblclick(event)
	{

		if (isClick == false)
			return;
		event.preventDefault();

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y =  - (event.clientY / window.innerHeight) * 2 + 1;
		ObjectClick();
		isClick = false;

	}

	function mouseUp(event)
	{

		event.preventDefault();
		isClick = true;
		flag = mouseFlags.MOUSEUP;

	}
	
window.onload = function () { freecontrol(); 
}	
				
	function freecontrol() {
		raycaster.setFromCamera(mouse, camera);
		var targetPos = new THREE.Vector3();
		var intersects = raycaster.intersectObjects(scene.children, true);
		
		Objcontrol.enabled = false;
		camera.position.y = 1.5;
		targetPos = new THREE.Vector3();
		targetPos.x = 0;
		targetPos.y = camera.position.y;
		targetPos.z = 0;
		temppos = targetPos;
		if (orbit == null)
		{
			orbit = new THREE.OrbitControls(camera, renderer.domElement);
		}
		if (orbit != null)
		{
			orbit.autoRotate = false;
			orbit.target = targetPos;
			orbit.maxPolarAngle = Math.PI;
			orbit.minDistance = 0.1; // the minimum distance the camera must have from center
			orbit.maxDistance = 0.13; // the maximum distance the camera must have from center
			orbit.enableZoom = true;
		}

		$('html,body').css('cursor', 'pointer');
		TWEEN.removeAll();

		var tween = new TWEEN.Tween(camera.position).to(camera.position, 1000).easing(TWEEN.Easing.Quadratic.InOut).onComplete(
		function ()
			{
				orbit.enableZoom = true;
				orbit.enabled = true;
				$('html,body').css('cursor', 'grab');
				$('html,body').css('cursor', '-webkit-grab');

			}).start();
	}
	
	
	
	var selectedObject;
	function ObjectOutline()
	{
		raycaster.setFromCamera(mouse, camera);
		var intersects = raycaster.intersectObjects(scene.children, true);

		if (intersects.length > 0)
		{
		//	 console.log(intersects[0].object.name);
			intersects[0].object.material.shading = THREE.SmoothShading;
			if (intersects[0].object.name == "round1" || intersects[0].object.name == "round2" || intersects[0].object.name == "round3" || intersects[0].object.name == "round4")
			{
				rotateSphere = intersects[0].object;
				isRoundRotation = true;
				rotateSphere.scale.set(1.4, 1.34, 1.4);
				$('html,body').css('cursor', 'pointer');
			}
			else
			{
				if (rotateSphere != null)
				{
					rotateSphere.scale.set(1.2, 1.14, 1.2);
					isRoundRotation = false;
				}
				rotateSphere = null;
			}

			if (currentObj != objectList.None)
				return;

			if (intersects[0].object.name == "Shoes" || intersects[0].object.name == "camara" || intersects[0].object.name == "Purse" || intersects[0].object.name == "Girl" || intersects[0].object.name == "CelingLamp"
				 || intersects[0].object.name == "Table" || intersects[0].object.name == "SOFA" || intersects[0].object.name == "SofaChair02" || intersects[0].object.name == "SofaChair01"
				 || intersects[0].object.name == "Logo")
			{
				outlinePass.edgeThickness = 0.5;
				outlinePass.enabled=true;
				selectedObject = intersects[0].object;
				outlinePass.selectedObjects = [selectedObject];

				$('html,body').css('cursor', 'pointer');

			}
			else
			{
				outlinePass.edgeThickness = 0;
					$('html,body').css('cursor', 'grab');
					$('html,body').css('cursor', '-webkit-grab');

			}
		}
	}

	
	function SphereClick() {
		raycaster.setFromCamera(mouse, camera);
		var targetPos = new THREE.Vector3();
		var intersects = raycaster.intersectObjects(scene.children, true);
		if (intersects.length > 0)
			{
				if (intersects[0].object.name == "round1" 
					|| intersects[0].object.name == "round2" 
					|| intersects[0].object.name == "round3" 
					|| intersects[0].object.name == "round4")
				{
					var num = 3;
					if (intersects[0].object.name == "round1")
					{
						num = 1;
					}
					if (intersects[0].object.name == "round2")
					{
						num = 2;
					}
					if (intersects[0].object.name == "round3")
					{
						num = 3;
					}
					if (intersects[0].object.name == "round4")
					{
						num = 4;
					}
					outlinePass.edgeThickness = 0.8;
					selectedround = intersects[0].object;
					outlinePass.selectedObjects = [selectedround];

					switch (currentObj)
					{
					case objectList.PurseObj:
						SetTexturetoModel(curinterset, num);
						purseId = num;
						break;
					case objectList.TableObj:
						SetTexturetoModel(curinterset, num);
						tableId = num;
						break;
					case objectList.SofaChair02Obj:
						SetTexturetoModel(curinterset, num);
						sofaChair02Id = num;
						break;
					case objectList.SofaChair01Obj:
						SetTexturetoModel(curinterset, num);
						sofaChair01Id = num;
						break;
					case objectList.SofaObj:
						SetTexturetoModel(curinterset, num);
						sofaId = num;
						break;
					case objectList.CelingLampObj:
						SetTexturetoModel(curinterset, num);
						lampId = num;
						break;
					case objectList.GirlObj:
						SetTexturetoModel(curinterset, num);
						coatId = num;
						break;
					}
				}
				isClick = false;
			}
		}
	
	function ObjectClick() //event
	{
		raycaster.setFromCamera(mouse, camera);
		var targetPos = new THREE.Vector3();
		var intersects = raycaster.intersectObjects(scene.children, true);
		if (isClick)
		{
			if (intersects.length > 0)
			{
				// console.log(intersects[0].object.name);
				if (intersects[0].object.name == "Floor")
				{
					BoolSet();
					Objcontrol.enabled = false;
					camera.position.y = 1.5;
					targetPos = new THREE.Vector3();
					targetPos.x = intersects[0].point.x;
					targetPos.y = camera.position.y;
					targetPos.z = intersects[0].point.z;
					temppos = targetPos;
					if (orbit == null)
					{
						orbit = new THREE.OrbitControls(camera, renderer.domElement);
					}
					if (orbit != null)
					{
						orbit.autoRotate = false;
						orbit.target = targetPos;
						orbit.maxPolarAngle = Math.PI;
						orbit.minDistance = 0.1; // the minimum distance the camera must have from center
						orbit.maxDistance = 0.13; // the maximum distance the camera must have from center
						orbit.enableZoom = true;
					}
					currentPos = new THREE.Vector3();
					currentPos.x = intersects[0].point.x;
					currentPos.y = camera.position.y;
					currentPos.z = camera.position.z;
					$('html,body').css('cursor', 'pointer');
					TWEEN.removeAll();

					var tween = new TWEEN.Tween(camera.position).to(camera.position, 1000).easing(TWEEN.Easing.Quadratic.InOut).onComplete(
							function ()
						{
							orbit.enableZoom = true;
							orbit.enabled = true;
							$('html,body').css('cursor', 'grab');
							$('html,body').css('cursor', '-webkit-grab');

						}
						).start();

				}
				// console.log(intersects[ 0 ].object.name);

				if (intersects[0].object.name == "camara" && IsCamera == false)
				{
					BoolSet();
					$("#sceneclose").css("display","block");
					IsCamera = true;
					camera.position.y = 1.5;
					targetPos = new THREE.Vector3();
					targetPos.x = intersects[0].point.x + 0.5; //+0.3;
					targetPos.y = intersects[0].point.y + 0.5; //camera.position.y;
					targetPos.z = intersects[0].point.z + 0.2;

					ShowContent();
					if (orbit == null)
					{
						orbit = new THREE.OrbitControls(camera, renderer.domElement);
					}
					if (orbit != null)
					{
						orbit.target = intersects[0].point;
					}
					temppos = targetPos;
					TWEEN.removeAll();
					var tween = new TWEEN.Tween(camera.position).to(targetPos, 1000).easing(TWEEN.Easing.Quadratic.InOut).onComplete(
							function ()
						{

							OrbitControllerSet();
							ObjectDetailDisplay('Camera');
							orbit.minDistance = 0.8;
							orbit.maxDistance = 2.8;
						}
						).start();
				}
				if (intersects[0].object.name == "Shoes" && IsShoes == false)
				{
					BoolSet();
					$("#sceneclose").css("display","block");
					
					IsShoes = true;
					camera.position.y = 1.5;
					targetPos = new THREE.Vector3();
					targetPos.x = intersects[0].object.position.x;
					targetPos.y = intersects[0].object.position.y; //camera.position.y;
					targetPos.z = intersects[0].object.position.z; //+0.1;
					ShowContent();

					if (orbit == null)
					{
						orbit = new THREE.OrbitControls(camera, renderer.domElement);
					}
					if (orbit != null)
					{
						orbit.target = intersects[0].object.position;
					}
					temppos = targetPos;
					TWEEN.removeAll();
					var tween = new TWEEN.Tween(camera.position).to(intersects[0].point, 1000).easing(TWEEN.Easing.Quadratic.InOut).onComplete(
							function ()
						{

							OrbitControllerSet();
							orbit.minDistance = 0.8;
							orbit.maxDistance = 2.6;
							ObjectDetailDisplay('Shoes');
						}
						).start();
				}

				if (intersects[0].object.name == "Purse" && IsPurse == false)
				{
					BoolSet();
					$("#sceneclose").css("display","block");
					
					IsPurse = true;
					camera.position.y = 1.5;
					targetPos = new THREE.Vector3();
					targetPos.x = intersects[0].object.position.x;
					targetPos.y = intersects[0].object.position.y - 0.1;
					targetPos.z = intersects[0].object.position.z;
					ShowContent();
					if (orbit == null)
					{
						orbit = new THREE.OrbitControls(camera, renderer.domElement);
					}
					if (orbit != null)
					{
						orbit.target = targetPos;
					}
					temppos = targetPos;
					curinterset = intersects[0].object;
					TWEEN.removeAll();
					var tween = new TWEEN.Tween(camera.position).to(intersects[0].point, 1000).easing(TWEEN.Easing.Quadratic.InOut).onComplete(
							function ()
						{

							OrbitControllerSet();
							orbit.minDistance = 1; //0.8
							orbit.maxDistance = 2.2; //1

							currentObj = objectList.PurseObj;
							SphereStatus();
							ObjectDetailDisplay('Purse');
						}
						).start();

				}

				if (intersects[0].object.name == "Girl" && IsCoat == false)
				{

					BoolSet();
					IsCoat = true;
					$("#sceneclose").css("display","block");
					
					camera.position.y = 1.5;
					targetPos = new THREE.Vector3();
					targetPos.x = 1.5;
					targetPos.y = 1;
					targetPos.z = 0.7;
					ShowContent();
					if (orbit == null)
					{
						orbit = new THREE.OrbitControls(camera, renderer.domElement);
					}
					if (orbit != null)
					{
						orbit.target = intersects[0].point;
					}
					temppos = targetPos;
					curinterset = intersects[0].object;
					TWEEN.removeAll();
					var tween = new TWEEN.Tween(camera.position).to(curinterset, 1000).easing(TWEEN.Easing.Quadratic.InOut).onComplete(
							function ()
						{
							OrbitControllerSet();
							orbit.minDistance = 1.3; // the minimum distance the camera must have from center
							orbit.maxDistance = 1.8; // the maximum distance the camera must have from center
							currentObj = objectList.GirlObj;
							SphereStatus();
							ObjectDetailDisplay('Girl');
						}
						).start();
				}

				if (intersects[0].object.name == "CelingLamp" && IsCelingLamp == false)
				{
					BoolSet();
					$("#sceneclose").css("display","block");
					
					IsCelingLamp = true;
					targetPos = new THREE.Vector3();
					targetPos.x = intersects[0].object.position.x;
					targetPos.y = intersects[0].object.position.y;
					targetPos.z = intersects[0].object.position.z;
					curinterset = intersects[0].object;
					ShowContent();
					if (orbit == null)
					{
						orbit = new THREE.OrbitControls(camera, renderer.domElement);
					}
					if (orbit != null)
					{
						orbit.target = targetPos;
					}
					temppos = targetPos;
					TWEEN.removeAll();
					var tween = new TWEEN.Tween(camera.position).to(intersects[0].point, 1000).easing(TWEEN.Easing.Quadratic.InOut).onComplete(
							function ()
						{

							OrbitControllerSet();
							orbit.minDistance = 0.9;
							orbit.maxDistance = 2.8;
							currentObj = objectList.CelingLampObj;
							SphereStatus();
							ObjectDetailDisplay('Lamp');

						}
						).start();
				}

				if (intersects[0].object.name == "Table" && IsTable == false)
				{
					BoolSet();
					$("#sceneclose").css("display","block");
					
					IsTable = true;
					targetPos = new THREE.Vector3();
					targetPos.x = intersects[0].object.position.x;
					targetPos.y = intersects[0].object.position.y + 0.1;
					targetPos.z = intersects[0].object.position.z;
					curinterset = intersects[0].object;
					ShowContent();
					if (orbit == null)
					{
						orbit = new THREE.OrbitControls(camera, renderer.domElement);
					}
					if (orbit != null)
					{
						orbit.target = targetPos; //intersects[0].point;
					}
					temppos = targetPos;
					TWEEN.removeAll();
					var tween = new TWEEN.Tween(camera.position).to(intersects[0].object.position, 1000).easing(TWEEN.Easing.Quadratic.InOut).onComplete(
							function ()
						{
							OrbitControllerSet();
							orbit.maxPolarAngle = Math.PI / 2;
							orbit.minDistance = 1.24;
							orbit.maxDistance = 2.24;
							currentObj = objectList.TableObj;
							SphereStatus();
							ObjectDetailDisplay('Table');
						}).start();
					}
				if (intersects[0].object.name == "SOFA" && ISSofa == false)
				{
					BoolSet();
					ISSofa = true;
					$("#sceneclose").css("display","block");
					
					targetPos = new THREE.Vector3();
					targetPos.x = intersects[0].object.position.x;
					targetPos.y = intersects[0].object.position.y - 0.1;
					targetPos.z = intersects[0].object.position.z - 0.2;
					curinterset = intersects[0].object;

					ShowContent();
					if (orbit == null)
					{
						orbit = new THREE.OrbitControls(camera, renderer.domElement);
					}
					if (orbit != null)
					{
						orbit.target = targetPos; //intersects[0].point;
					}
					temppos = targetPos;
					TWEEN.removeAll(); // targetPos
					var tween = new TWEEN.Tween(camera.position).to(intersects[0].object.position, 1000).easing(TWEEN.Easing.Quadratic.InOut).onComplete(
							function ()
						{

							OrbitControllerSet();
							orbit.maxPolarAngle = Math.PI / 2;
							orbit.minDistance = 2.3; //1.7
							orbit.maxDistance = 2.4; //1.8
							currentObj = objectList.SofaObj;
							SphereStatus();
							ObjectDetailDisplay('Sofa');
						}
						).start();

				}
				if (intersects[0].object.name == "SofaChair02" && IsSofaChair2 == false)
				{
					BoolSet();
					$("#sceneclose").css("display","block");
					
					IsSofaChair2 = true;
					targetPos = new THREE.Vector3();
					targetPos.x = intersects[0].object.position.x; //-0.5;
					targetPos.y = intersects[0].object.position.y - 0.1;
					targetPos.z = intersects[0].object.position.z; //-0.2;
					curinterset = intersects[0].object;
					ShowContent();
					if (orbit == null)
					{
						orbit = new THREE.OrbitControls(camera, renderer.domElement);
					}
					if (orbit != null)
					{
						orbit.target = targetPos; //intersects[0].point;
					}
					temppos = targetPos;
					TWEEN.removeAll();
					var tween = new TWEEN.Tween(camera.position).to(intersects[0].point, 1000).easing(TWEEN.Easing.Quadratic.InOut).onComplete(
							function ()
						{

							OrbitControllerSet();
							orbit.maxPolarAngle = Math.PI / 2;
							orbit.minDistance = 1.7;
							orbit.maxDistance = 1.9;
							currentObj = objectList.SofaChair02Obj;
							SphereStatus();
							ObjectDetailDisplay('Sofa');
						}
						).start();

				}
				if (intersects[0].object.name == "SofaChair01" && IsSofaChair1 == false)
				{
					BoolSet();
					IsSofaChair1 = true;
					$("#sceneclose").css("display","block");
					
					targetPos = new THREE.Vector3();
					targetPos.x = intersects[0].object.position.x;
					targetPos.y = intersects[0].object.position.y + 0.1;
					targetPos.z = intersects[0].object.position.z;
					curinterset = intersects[0].object;
					ShowContent();
					if (orbit == null)
					{
						orbit = new THREE.OrbitControls(camera, renderer.domElement);
					}
					if (orbit != null)
					{
						orbit.target = targetPos; //intersects[0].point;
					}
					temppos = targetPos;
					TWEEN.removeAll();
					var tween = new TWEEN.Tween(camera.position).to(intersects[0].object.position, 1000).easing(TWEEN.Easing.Quadratic.InOut).onComplete(
							function ()
						{

							OrbitControllerSet();
							orbit.maxPolarAngle = Math.PI / 2;
							orbit.minDistance = 1.7;
							orbit.maxDistance = 1.9;
							currentObj = objectList.SofaChair01Obj;
							SphereStatus();
							ObjectDetailDisplay('Sofa');
						}
						).start();

				}

				if (intersects[0].object.name == "Logo" && IsLogo == false)
				{
										$("#sceneclose").css("display","block");
					BoolSet();
					IsLogo = true;
					targetPos = new THREE.Vector3();
					targetPos.x = -0.2374 // -0.2374 intersects[0].point.x;
					targetPos.y = 1.598 //1.598 intersects[0].point.y;
					targetPos.z = -1.314; //-1.314 intersects[0].point.z + 2.3;
					temppos = targetPos;
					ShowContent();
					if (orbit == null)
					{
						orbit = new THREE.OrbitControls(camera, renderer.domElement);
					}
					if (orbit != null)
					{
						orbit.autoRotate = true;
						orbit.target = targetPos;
						orbit.minDistance = 0.1; // the minimum distance the camera must have from center
						orbit.maxDistance = 0.13; // the maximum distance the camera must have from center
						orbit.enableZoom = true;
						
					}

					TWEEN.removeAll();
					var tween = new TWEEN.Tween(camera.position).to(camera.position, 1000).easing(TWEEN.Easing.Quadratic.InOut).start();
					var qa = camera.quaternion;
					var qm = new THREE.Quaternion();
					var tween1 = new TWEEN.Tween(qa).to(qm, 1000).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(
							function ()
						{
							camera.quaternion.set(qm.x, qm.y, qm.z, qm.w);

						}
						).onComplete(

							function ()
						{
							OrbitControllerSet();
							ObjectDetailDisplay('Logo');
						}
						).start();

				}
				isClick = false;
			}
		}
	}

	function BoolSet()
	{
		IsCamera = false;
		IsPurse = false;
		IsCoat = false;
		IsCelingLamp = false;
		IsLogo = false;
		IsTable = false;
		IsTv = false;
		ISSofa = false;
		IsSofaChair1 = false;
		IsSofaChair2 = false;
		IsShoes = false;
		currentObj = objectList.None;
		SphereStatus();
		ObjectDetailDisplay('None');
		HideContent();
	}

	function OrbitControllerSet()
	{
		Objcontrol.enabled = false;

		if (orbit == null)
		{
			orbit = new THREE.OrbitControls(camera, renderer.domElement);
			orbit.enabled = true;
		}
		if (orbit != null)
		{ 	//	orbit.reset();
			orbit.enabled = true;
			orbit.smooth = true;
			orbit.zoomSpeed = 0.6; // control the zoomIn and zoomOut speed
			orbit.enableZoom = true;
			orbit.autoRotate = true;
			orbit.enableDamping = true;
			orbit.autoRotateSpeed = 0.35;
			orbit.dampingFactor = 0.2;
		}
	}

	var sphere;
	function SphereLoad()
	{
		var loader = new THREE.ObjectLoader();
		loader.load('models/njson/Round.json', function (obj)
		{
			obj.scale.set(0.0001, 0.0001, 0.0001); //obj.scale.set(1.2,1.14,1.2);
			round1 = obj;
			round1.name = 'round1';
			camera.add(round1);
			round1.position.set(-0.15, -0.17, -0.5); //-0.17
			scene.add(camera);
		});

		var loader1 = new THREE.ObjectLoader();
		loader1.load('models/njson/Round.json', function (obj)
		{
			obj.scale.set(0.0001, 0.0001, 0.0001);
			round2 = obj;
			round2.name = 'round2';
			camera.add(round2);
			round2.position.set(-0.05, -0.17, -0.5);
			scene.add(camera);
		});
		
		var loader2 = new THREE.ObjectLoader();
		loader2.load('models/njson/Round.json', function (obj)
		{
			obj.scale.set(0.0001, 0.0001, 0.0001);
			round3 = obj;
			round3.name = 'round3';
			camera.add(round3);
			round3.position.set(0.05, -0.17, -0.5);
			scene.add(camera);
		});
		
		var loader3 = new THREE.ObjectLoader();
		loader3.load('models/njson/Round.json', function (obj)
		{
			obj.scale.set(0.0001, 0.0001, 0.0001);
			round4 = obj;
			round4.name = 'round4';
			camera.add(round4);
			round4.position.set(0.15, -0.17, -0.5);
			scene.add(camera);
			SphereStatus();
		});

		currentObj = objectList.None;
	}

	function SphereStatus()
	{
		targetscale1 = new THREE.Vector3(0.0001, 0.0001, 0.0001);
		targetscale2 = new THREE.Vector3(1.2, 1.2, 1.2); //1.14
		var objstaus = false;
		var id;
		switch (currentObj)
		{

		case objectList.None:
			objstaus = false;
			break;
		case objectList.PurseObj:
			objstaus = true;
			SphereTextureLoad();
			id = purseId;
			break;
		case objectList.TableObj:
			objstaus = true;
			SphereTextureLoad();
			id = tableId;
			break;
		case objectList.SofaChair02Obj:
			objstaus = true;
			SphereTextureLoad();
			id = sofaChair02Id;
			break;
		case objectList.SofaChair01Obj:
			objstaus = true;
			SphereTextureLoad();
			id = sofaChair01Id;
			break;
		case objectList.SofaObj:
			objstaus = true;
			SphereTextureLoad();
			id = sofaId;
			break;
		case objectList.CelingLampObj:
			objstaus = true;
			SphereTextureLoad();
			id = lampId;
			break;
		case objectList.GirlObj:
			objstaus = true;
			SphereTextureLoad();
			id = coatId;
			break;
		}
		round1.visible = objstaus;
		round2.visible = objstaus;
		round3.visible = objstaus;
		round4.visible = objstaus;

		if (!objstaus)
		{
			round1.scale.set(0.0001, 0.0001, 0.0001);
			round2.scale.set(0.0001, 0.0001, 0.0001);
			round3.scale.set(0.0001, 0.0001, 0.0001);
			round4.scale.set(0.0001, 0.0001, 0.0001);

		}
		else
		{

			var tween1 = new TWEEN.Tween(round1.scale).to(targetscale2, 200).easing(TWEEN.Easing.Quadratic.In).start();
			var tween2 = new TWEEN.Tween(round2.scale).to(targetscale2, 400).easing(TWEEN.Easing.Quadratic.In).start();
			var tween3 = new TWEEN.Tween(round3.scale).to(targetscale2, 600).easing(TWEEN.Easing.Quadratic.In).start();
			var tween4 = new TWEEN.Tween(round4.scale).to(targetscale2, 800).easing(TWEEN.Easing.Quadratic.In).onComplete(
					function ()
				{
					if (id === 1)
					{
						outlinePass.edgeThickness = 0.5;
						selectedround = round1;
						outlinePass.selectedObjects = [selectedround];
					}
					if (id === 2)
					{
						outlinePass.edgeThickness = 0.5;
						selectedround = round2;
						outlinePass.selectedObjects = [selectedround];
					}
					if (id === 3)
					{
						outlinePass.edgeThickness = 0.5;
						selectedround = round3;
						outlinePass.selectedObjects = [selectedround];
					}
					if (id === 4)
					{
						outlinePass.edgeThickness = 0.5;
						selectedround = round4;
						outlinePass.selectedObjects = [selectedround];
					}

				}
				).start();
		}

	}

	function SphereTextureLoad()
	{

		SetTexturetoSphere(round1, 1);
		SetTexturetoSphere(round2, 2);
		SetTexturetoSphere(round3, 3);
		SetTexturetoSphere(round4, 4);
	}

	function sphereRotation()
	{
		rotateSphere.rotation.y += rotationSpeed;
	}

	// TOUCH - move
	this.domElement.addEventListener('touchstart', onTouchStartX, false);
	this.domElement.addEventListener('touchmove', onTouchMoveX, false);
	this.domElement.addEventListener('touchend', onTouchEndX, false);

	function onTouchStartX(event)
	{
		isClick = true;
		flag = mouseFlags.MOUSEDOWN;
		

	}

	function onTouchEndX(event)
	{
		if (isClick === false)
			return;
		event.preventDefault();
		event = event.changedTouches[0];
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y =  - (event.clientY / window.innerHeight) * 2 + 1;
		ObjectClick();
		SphereClick();
		isClick = false;
	}

	//TOUCH - Zoom
	function onTouchMoveX(event)
	{
		isClick = false;
		try
		{
			event.preventDefault();
		}
		catch (ev)
		{}

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y =  - (event.clientY / window.innerHeight) * 2 + 1;
		ObjectOutline();
		flag = mouseFlags.MOUSEMOVE;
	}

	function animate(time)
	{
		if (orbit != null && orbit.enabled == true)
		{
			orbit.update();
		}
		if (isRoundRotation)
		{
			sphereRotation();
		}
		requestAnimationFrame(animate);
		TWEEN.update(time);

	}

	function dispose()
	{

		this.domElement.addEventListener('mousedown', mouseDown, false);
		this.domElement.addEventListener('mousemove', mouseMove, false);
		this.domElement.addEventListener('mouseup', mouseUp, false);
		this.domElement.addEventListener('dblclick', dblclick, false);

		this.domElement.addEventListener('touchstart', onTouchStartX, false);
		this.domElement.addEventListener('touchmove', onTouchMoveX, false);
		this.domElement.addEventListener('touchend', onTouchEndX, false);

	}

	var pursebutton = [4];
	var girlbutton = [4];
	var tablebutton = [4];
	var sofabutton = [4];
	var lampbutton = [4];

	var pursetexture = [4];
	var girltexture = [4];
	var lamptexture = [4];
	var tabletexture = [4];
	var sofachair01texture = [4];
	var sofachair02texture = [4];

	var sofaUptexture = [4];
	var sofaDowntexture = [4];

	function mdlTextureLoad()
	{
		// Purse Model Texture Load
		modelTextureLoad(0, 'Texture/ModelTexture/Purse/1.jpg', 'Purse');
		modelTextureLoad(1, 'Texture/ModelTexture/Purse/2.jpg', 'Purse');
		modelTextureLoad(2, 'Texture/ModelTexture/Purse/3.jpg', 'Purse');
		modelTextureLoad(3, 'Texture/ModelTexture/Purse/4.jpg', 'Purse');

		// Girl Model Texture Load
		modelTextureLoad(0, 'Texture/ModelTexture/Girl/1.jpg', 'Girl');
		modelTextureLoad(1, 'Texture/ModelTexture/Girl/2.jpg', 'Girl');
		modelTextureLoad(2, 'Texture/ModelTexture/Girl/3.jpg', 'Girl');
		modelTextureLoad(3, 'Texture/ModelTexture/Girl/4.jpg', 'Girl');

		// Lamp Model Texture Load
		modelTextureLoad(0, 'Texture/ModelTexture/Lamp/1.jpg', 'Lamp');
		modelTextureLoad(1, 'Texture/ModelTexture/Lamp/2.jpg', 'Lamp');
		modelTextureLoad(2, 'Texture/ModelTexture/Lamp/3.jpg', 'Lamp');
		modelTextureLoad(3, 'Texture/ModelTexture/Lamp/4.jpg', 'Lamp');

		// Table Model Texture Load
		modelTextureLoad(0, 'Texture/ModelTexture/Table/1.jpg', 'Table');
		modelTextureLoad(1, 'Texture/ModelTexture/Table/2.jpg', 'Table');
		modelTextureLoad(2, 'Texture/ModelTexture/Table/3.jpg', 'Table');
		modelTextureLoad(3, 'Texture/ModelTexture/Table/4.jpg', 'Table');

		// SofaChair 01 Texture Load
		modelTextureLoad(0, 'Texture/ModelTexture/SofaChair01/1.jpg', 'SofaChair01');
		modelTextureLoad(1, 'Texture/ModelTexture/SofaChair01/2.jpg', 'SofaChair01');
		modelTextureLoad(2, 'Texture/ModelTexture/SofaChair01/3.jpg', 'SofaChair01');
		modelTextureLoad(3, 'Texture/ModelTexture/SofaChair01/4.jpg', 'SofaChair01');

		// SofaChair 02 Texture Load
		modelTextureLoad(0, 'Texture/ModelTexture/SofaChair02/1.jpg', 'SofaChair02');
		modelTextureLoad(1, 'Texture/ModelTexture/SofaChair02/2.jpg', 'SofaChair02');
		modelTextureLoad(2, 'Texture/ModelTexture/SofaChair02/3.jpg', 'SofaChair02');
		modelTextureLoad(3, 'Texture/ModelTexture/SofaChair02/4.jpg', 'SofaChair02');

		// sofaUp  Texture Load
		modelTextureLoad(0, 'Texture/ModelTexture/SofaUp/1.jpg', 'SofaUp');
		modelTextureLoad(1, 'Texture/ModelTexture/SofaUp/2.jpg', 'SofaUp');
		modelTextureLoad(2, 'Texture/ModelTexture/SofaUp/3.jpg', 'SofaUp');
		modelTextureLoad(3, 'Texture/ModelTexture/SofaUp/4.jpg', 'SofaUp');
		// sofaUp  Texture Load
		modelTextureLoad(0, 'Texture/ModelTexture/SofaDown/1.jpg', 'SofaDown');
		modelTextureLoad(1, 'Texture/ModelTexture/SofaDown/2.jpg', 'SofaDown');
		modelTextureLoad(2, 'Texture/ModelTexture/SofaDown/3.jpg', 'SofaDown');
		modelTextureLoad(3, 'Texture/ModelTexture/SofaDown/4.jpg', 'SofaDown');

	}

	function modelTextureLoad(id, path, modeltype)
	{
		var loader = new THREE.TextureLoader();
		// load a resource
		loader.load(
			// resource URL
			path,

			// onLoad callback
			function (texture)
		{

			if (modeltype === 'Purse')
				pursetexture[id] = texture;
			if (modeltype === 'Girl')
				girltexture[id] = texture;
			if (modeltype === 'Table')
				tabletexture[id] = texture;
			if (modeltype === 'Lamp')
				lamptexture[id] = texture;
			if (modeltype === 'SofaChair01')
				sofachair01texture[id] = texture;
			if (modeltype === 'SofaChair02')
				sofachair02texture[id] = texture;
			if (modeltype === 'SofaUp')
				sofaUptexture[id] = texture;
			if (modeltype === 'SofaDown')
				sofaDowntexture[id] = texture;

		},

			undefined,

			// onError callback
			function (err)
		{
			console.error('An error happened.' + path);
		}
		);

	}

	function SetTexturetoModel(obj, id)
	{
		if (obj.material != null)
		{
			switch (currentObj)
			{
			case objectList.PurseObj:
				obj.material.map = pursetexture[id - 1];
				break;
			case objectList.GirlObj:
				obj.material.map = girltexture[id - 1];
				break;
			case objectList.TableObj:
				obj.material.map = tabletexture[id - 1];
				break;
			case objectList.SofaObj:
				obj.material[0].map = sofaUptexture[id - 1];
				obj.material[1].map = sofaDowntexture[id - 1];
				break;
			case objectList.SofaChair01Obj:
				obj.material.map = sofachair01texture[id - 1];
				break;
			case objectList.SofaChair02Obj:
				obj.material.map = sofachair02texture[id - 1];
				break;
			case objectList.CelingLampObj:
				obj.material.map = lamptexture[id - 1];
				break;

			}

		}

	}

	function BtnTextureLoad()
	{
		// Purse Button Texture Load
		ButtonTextureLoad(0, 'Texture/Button/Purse/1.jpg', 'Purse');
		ButtonTextureLoad(1, 'Texture/Button/Purse/2.jpg', 'Purse');
		ButtonTextureLoad(2, 'Texture/Button/Purse/3.jpg', 'Purse');
		ButtonTextureLoad(3, 'Texture/Button/Purse/4.jpg', 'Purse');

		// Lady Button Texture Load
		ButtonTextureLoad(0, 'Texture/Button/Girl/1.jpg', 'Girl');
		ButtonTextureLoad(1, 'Texture/Button/Girl/2.jpg', 'Girl');
		ButtonTextureLoad(2, 'Texture/Button/Girl/3.jpg', 'Girl');
		ButtonTextureLoad(3, 'Texture/Button/Girl/4.jpg', 'Girl');

		// Table Button Texture Load

		ButtonTextureLoad(0, 'Texture/Button/Table/1.jpg', 'Table');
		ButtonTextureLoad(1, 'Texture/Button/Table/2.jpg', 'Table');
		ButtonTextureLoad(2, 'Texture/Button/Table/3.jpg', 'Table');
		ButtonTextureLoad(3, 'Texture/Button/Table/4.jpg', 'Table');

		// Sofa Button Texture Load
		ButtonTextureLoad(0, 'Texture/Button/Sofa/1.jpg', 'Sofa');
		ButtonTextureLoad(1, 'Texture/Button/Sofa/2.jpg', 'Sofa');
		ButtonTextureLoad(2, 'Texture/Button/Sofa/3.jpg', 'Sofa');
		ButtonTextureLoad(3, 'Texture/Button/Sofa/4.jpg', 'Sofa');

		// Lamp Button Texture Load
		ButtonTextureLoad(0, 'Texture/Button/Lamp/1.jpg', 'Lamp');
		ButtonTextureLoad(1, 'Texture/Button/Lamp/2.jpg', 'Lamp');
		ButtonTextureLoad(2, 'Texture/Button/Lamp/3.jpg', 'Lamp');
		ButtonTextureLoad(3, 'Texture/Button/Lamp/4.jpg', 'Lamp');

	}

	function ButtonTextureLoad(id, path, btntype)
	{
		var loader = new THREE.TextureLoader();
		// load a resource
		loader.load(
			// resource URL
			path,

			// onLoad callback
			function (texture)
		{

			if (btntype === 'Purse')
				pursebutton[id] = texture;
			if (btntype === 'Girl')
				girlbutton[id] = texture;
			if (btntype === 'Table')
				tablebutton[id] = texture;
			if (btntype === 'Sofa')
				sofabutton[id] = texture;
			if (btntype === 'Lamp')
				lampbutton[id] = texture;

		},

			undefined,

			// onError callback
			function (err)
		{
			console.error('An error happened.' + path);
		}
		);

	}

	function SetTexturetoSphere(obj, id)
	{
		if (obj.material != null)
		{
			switch (currentObj)
			{
			case objectList.PurseObj:
				obj.material.map = pursebutton[id - 1];
				break;
			case objectList.GirlObj:
				obj.material.map = girlbutton[id - 1];
				break;
			case objectList.TableObj:
				obj.material.map = tablebutton[id - 1];
				break;
			case objectList.SofaObj:
				obj.material.map = sofabutton[id - 1];
				break;
			case objectList.SofaChair01Obj:
				obj.material.map = sofabutton[id - 1];
				break;
			case objectList.SofaChair02Obj:
				obj.material.map = sofabutton[id - 1];
				break;
			case objectList.CelingLampObj:
				obj.material.map = lampbutton[id - 1];
				break;

			}

		}

	}

	function ObjectDetailDisplay(event)
	{

		switch (event)
		{
		case 'Camera':

			$(".content1").addClass("text-content2");
			$(".content2").removeClass("text-content2");
			$(".content3").removeClass("text-content2");
			$(".content4").removeClass("text-content2");
			$(".content5").removeClass("text-content2");
			$(".content6").removeClass("text-content2");
			$(".content7").removeClass("text-content2");
			$(".content8").removeClass("text-content2");
			$(".content9").removeClass("text-content2");
			$(".content10").removeClass("text-content2");
			$(".content11").removeClass("text-content2");
			break;
		case 'Shoes':
			$(".content11").addClass("text-content2");
			$(".content1").removeClass("text-content2");
			$(".content2").removeClass("text-content2");
			$(".content3").removeClass("text-content2");
			$(".content4").removeClass("text-content2");
			$(".content5").removeClass("text-content2");
			$(".content6").removeClass("text-content2");
			$(".content7").removeClass("text-content2");
			$(".content8").removeClass("text-content2");
			$(".content9").removeClass("text-content2");
			$(".content10").removeClass("text-content2");
			
			break;	
		case 'Purse':

			$(".content2").addClass("text-content2");
			$(".content1").removeClass("text-content2");
			$(".content3").removeClass("text-content2");
			$(".content4").removeClass("text-content2");
			$(".content5").removeClass("text-content2");
			$(".content6").removeClass("text-content2");
			$(".content7").removeClass("text-content2");
			$(".content8").removeClass("text-content2");
			$(".content9").removeClass("text-content2");
			$(".content10").removeClass("text-content2");
			$(".content11").removeClass("text-content2");
			break;
		case 'Girl':

			$(".content3").addClass("text-content2");
			$(".content1").removeClass("text-content2");
			$(".content2").removeClass("text-content2");
			$(".content4").removeClass("text-content2");
			$(".content5").removeClass("text-content2");
			$(".content6").removeClass("text-content2");
			$(".content7").removeClass("text-content2");
			$(".content8").removeClass("text-content2");
			$(".content9").removeClass("text-content2");
			$(".content10").removeClass("text-content2");
			$(".content11").removeClass("text-content2");
			break;
		case 'Lamp':

			$(".content4").addClass("text-content2");
			$(".content1").removeClass("text-content2");
			$(".content2").removeClass("text-content2");
			$(".content3").removeClass("text-content2");
			$(".content5").removeClass("text-content2");
			$(".content6").removeClass("text-content2");
			$(".content7").removeClass("text-content2");
			$(".content8").removeClass("text-content2");
			$(".content9").removeClass("text-content2");
			$(".content10").removeClass("text-content2");
			$(".content11").removeClass("text-content2");
			break;
		case 'Table':

			$(".content5").addClass("text-content2");
			$(".content1").removeClass("text-content2");
			$(".content2").removeClass("text-content2");
			$(".content3").removeClass("text-content2");
			$(".content4").removeClass("text-content2");
			$(".content6").removeClass("text-content2");
			$(".content7").removeClass("text-content2");
			$(".content8").removeClass("text-content2");
			$(".content9").removeClass("text-content2");
			$(".content10").removeClass("text-content2");
			$(".content11").removeClass("text-content2");
			break;
		case 'Sofa':

			$(".content6").addClass("text-content2");
			$(".content1").removeClass("text-content2");
			$(".content2").removeClass("text-content2");
			$(".content3").removeClass("text-content2");
			$(".content4").removeClass("text-content2");
			$(".content5").removeClass("text-content2");
			$(".content7").removeClass("text-content2");
			$(".content8").removeClass("text-content2");
			$(".content9").removeClass("text-content2");
			$(".content10").removeClass("text-content2");
			$(".content11").removeClass("text-content2");
			break;
		case 'Logo':

			$(".content7").addClass("text-content2");
			$(".content1").removeClass("text-content2");
			$(".content2").removeClass("text-content2");
			$(".content3").removeClass("text-content2");
			$(".content4").removeClass("text-content2");
			$(".content5").removeClass("text-content2");
			$(".content6").removeClass("text-content2");
			$(".content8").removeClass("text-content2");
			$(".content9").removeClass("text-content2");
			$(".content10").removeClass("text-content2");
			$(".content11").removeClass("text-content2");
			break;

		case 'None':

			$(".content1").removeClass("text-content2");
			$(".content2").removeClass("text-content2");
			$(".content3").removeClass("text-content2");
			$(".content4").removeClass("text-content2");
			$(".content5").removeClass("text-content2");
			$(".content6").removeClass("text-content2");
			$(".content7").removeClass("text-content2");
			$(".content8").removeClass("text-content2");
			$(".content9").removeClass("text-content2");
			$(".content10").removeClass("text-content2");
			$(".content11").removeClass("text-content2");

			break;

		}

	}

	function HideContent()
	{
		document.getElementById("Test").style.display = "none";
	}
	function ShowContent()
	{
		document.getElementById("Test").style.display = "block";
	}

	function SetCD1Video(obj)
	{
		obj.material.map = videoTextureCD1.texture;
		videoTextureCD1.texture.needsUpdate = true;
		videoTextureCD1.video.play();

	}
	function SetCD2Video(obj)
	{
		obj.material.map = videoTextureCD2.texture;
		videoTextureCD2.texture.needsUpdate = true;
		videoTextureCD2.video.play();

	}
	function SetCD3Video(obj)
	{
		obj.material.map = videoTextureCD3.texture;
		videoTextureCD3.texture.needsUpdate = true;
		videoTextureCD3.video.play();

	}

	function VideoPause()
	{
		videoTextureCD1.video.pause();
		videoTextureCD2.video.pause();
		videoTextureCD3.video.pause();
	}

};