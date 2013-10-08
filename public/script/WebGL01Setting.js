var objData = {
	vertices : [],
	colors : [],
	triangles : []
};

var lines;

var triangleVertexPositionBuffer;
var triangleVertexColorBuffer;
var triangleVertexIndexBuffer;
var rtheta = [0, 0, 0];
var control = 0;

var lastTime = 0;

var gl;
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();
var shaderProgram;

var mvPushMatrix = function() {
	var copy = mat4.create();
	mat4.set(mvMatrix, copy);
	mvMatrixStack.push(copy);
}

var mvPopMatrix = function() {
	if (mvMatrixStack.length == 0) {
		throw "Invalid popMatrix!";
	}
	mvMatrix = mvMatrixStack.pop();
}

var degToRad = function(degrees){
	return degrees * Math.PI / 180;
}

var initGL = function(canvas){
	try {
      gl = canvas.getContext("experimental-webgl");
      gl.viewportWidth = canvas.width;
      gl.viewportHeight = canvas.height;
    } catch(e) {
    }
    if (!gl) {
      alert("Could not initialise WebGL, sorry :-( ");
    }
}

var initShaders = function(){
	var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

var getShader = function(gl, id){
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
	  return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
	  if (k.nodeType == 3)
	      str += k.textContent;
	  k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
	  shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
	  shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
	  return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	  alert(gl.getShaderInfoLog(shader));
	  return null;
	}

	return shader;
}


var initBuffers = function(){
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objData.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = objData.vertices.length / 3;

    triangleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objData.colors), gl.STATIC_DRAW);
    triangleVertexColorBuffer.itemSize = 4;
    triangleVertexColorBuffer.numItems = objData.colors.length / 4;

    triangleVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleVertexIndexBuffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objData.triangles), gl.STATIC_DRAW);
	triangleVertexIndexBuffer.itemSize = 1;
    triangleVertexIndexBuffer.numItems = objData.triangles.length;
}

var webGLStart = function(){
	var canvas = document.getElementById("HW1Canvas");
	initGL(canvas);
	initShaders();
	initBuffers();

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	tick();
}

var tick = function(){
	requestAnimFrame(tick);

	drawScene();
    animate();
}

var animate = function(){
	var timeNow = new Date().getTime();
    if (lastTime != 0) {
      var elapsed = timeNow - lastTime;

      rtheta[control] += (90 * elapsed) / 1000.0;
      rtheta[control] %= 360;
    }
    lastTime = timeNow;
}



var drawScene = function(){
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	mat4.ortho(-2.0, 2.0, -2.0 * gl.viewportWidth / gl.viewportHeight,
            2.0 * gl.viewportWidth / gl.viewportHeight, -10.0, 10.0, pMatrix)
	mat4.identity(mvMatrix);
	// mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);

	mvPushMatrix();
	mat4.rotate(mvMatrix, degToRad(rtheta[0]), [1, 0, 0]);
	mat4.rotate(mvMatrix, degToRad(rtheta[1]), [0, 1, 0]);
	mat4.rotate(mvMatrix, degToRad(rtheta[2]), [0, 0, 1]);
    
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleVertexIndexBuffer);

    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, triangleVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    mvPopMatrix();

}

var setMatrixUniforms = function(){
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g,'');
	}
}

$(function(){

	$.get('teapot2.txt', function(data){
		lines = data.split('\n');
		var setting;
		for( var i = 0 ; i < lines.length ; ++i ){
			if(lines[i].trim() === "Vertices"){
				setting = "vertices";
				++i;
			}
			else if(lines[i].trim() === "Triangle_list"){
				setting = "triangles";
				++i;
			}
			else{
				objData[setting] = objData[setting].concat(lines[i].trim().split(/\s+/).map(function(x){ return parseFloat(x); }));
			}
		}

		var maxXValue = -Number.MAX_VALUE, maxYValue = -Number.MAX_VALUE, maxZValue = -Number.MAX_VALUE;
		var minXValue = Number.MAX_VALUE, minYValue = Number.MAX_VALUE, minZValue = Number.MAX_VALUE; 
		for( var i = 0 ; i < objData.vertices.length ; i += 3 ){
			maxXValue = (objData.vertices[i] > maxXValue)? objData.vertices[i] : maxXValue;
			maxYValue = (objData.vertices[i+1] > maxYValue)? objData.vertices[i+1] : maxYValue;
			maxZValue = (objData.vertices[i+2] > maxZValue)? objData.vertices[i+2] : maxZValue;

			minXValue = (objData.vertices[i] < minXValue)? objData.vertices[i] : minXValue;
			minYValue = (objData.vertices[i+1] < minYValue)? objData.vertices[i+1] : minYValue;
			minZValue = (objData.vertices[i+2] < minZValue)? objData.vertices[i+2] : minZValue;
		}

		for( var i = 0 ; i < objData.vertices.length ; i += 3 ){
			objData.vertices[i] -= (maxXValue + minXValue) / 2;
			objData.vertices[i+1] -= (maxYValue + minYValue) / 2;
			objData.vertices[i+2] -= (maxZValue + minZValue) / 2;
		}

		var scaleValue = 1.0;
		for( var i = 0 ; i < objData.vertices.length ; ++i ){
			scaleValue = (Math.max(objData.vertices[i]) > scaleValue)? Math.max(objData.vertices[i]) : scaleValue;
		}

		var colorIndex = 0;
		for( var i = 0 ; i < objData.vertices.length ; ++i ){
			objData.vertices[i] /= scaleValue;
			objData.colors[colorIndex++] = objData.vertices[i] + 1.0 / 2;
			if( i % 3 === 2 ) objData.colors[colorIndex++] = 1.0;
		}

		$('#HW1Canvas').mousedown(function(event) {
		    switch (event.which) {
		        case 1:
		            control = 0;
		            break;
		        case 2:
		            control = 1;
		            break;
		        case 3:
		            control = 2;
		            break;
	        }
    	});

    	$('body').on('contextmenu', '#HW1Canvas', function(e){ return false; });

		webGLStart();

	})
})