// Certaines de ces fonctions ont été récupérées du TP1 
// elle permettent de gérer les differentes opérations openGL

// Initialisation du contexte GL
function initGL(parCanvas) 
{
    try 
    {
        // Contexte webgl
        gl = parCanvas.getContext("webgl");
        gl.viewportWidth = parCanvas.width;
        gl.viewportHeight = parCanvas.height;
    } 
    catch (e) 
    {
        alert(e.message);
    }
    if (!gl) 
    {
        alert("Error lors de l'initialisation du contexte webgl.");
    }
}

// Verification du shader
function checkShader(parShader)
{
    if (!gl.getShaderParameter(parShader, gl.COMPILE_STATUS)) 
    {
        alert(gl.getShaderInfoLog(parShader));
    }
}
// Verification du programme
function checkProgram(parProgram)
{
    if (!gl.getProgramParameter(parProgram, gl.LINK_STATUS)) 
    {
        alert("Could not initialise shaders");
    }
}
// Compilation shader
function compileShader(gl, id, parShaderType) 
{
    // Récupération du shader dans la page html
    var shaderScript = document.getElementById(id);
    // ON vérifie qu'il a été trouvé
    if (!shaderScript) 
    {
        alert("Shader "+id+" non trouvé!");
        return null;
    }
    var str = "";
    var k = shaderScript.firstChild;
    while (k) 
    {
        if (k.nodeType == 3) 
        {
            str += k.textContent;
        }
        k = k.nextSibling;
    }
    //On crée le shader
    var shader = gl.createShader(parShaderType);
    // ON charge
    gl.shaderSource(shader, str);
    // On compile
    gl.compileShader(shader);
    // On vérifie
    checkShader(shader);
    return shader;
}   
function generateProgram(parVertexFile, parVertexFile)
{
    // Compilation fragment shader
    var fragmentShader = compileShader(gl, parVertex, gl.VERTEX_SHADER);
    // Compilation du vertex shader
    var vertexShader = compileShader(gl, parFragment, gl.FRAGMENT_SHADER);
    // On crée le programme
    shaderProgram = gl.createProgram();
    // On attache le vertex shader
    gl.attachShader(shaderProgram, vertexShader);
    // On attache le fragment shader
    gl.attachShader(shaderProgram, fragmentShader);
    // On link le programme
    gl.linkProgram(shaderProgram);
    // On vérifie le programme
    checkProgram(shaderProgram);
    //On utilise le programme
    gl.useProgram(shaderProgram);

    return shaderProgram;
}

function initUsualUniforms(parProgam)
{
    // On bind le vertex buffer object de position
    parProgam.vertexPositionAttribute = gl.getAttribLocation(parProgam, "position");
    gl.enableVertexAttribArray(parProgam.vertexPositionAttribute);

    // On bind le vertex buffer object de normale
    parProgam.vertexNormalAttribute = gl.getAttribLocation(parProgam, "normal");
    gl.enableVertexAttribArray(parProgam.vertexNormalAttribute);

    // On bind le vertex buffer object de tex coord
    parProgam.vertexTexCoordAttribute = gl.getAttribLocation(parProgam, "texcoord");
    gl.enableVertexAttribArray(parProgam.vertexTexCoordAttribute);                

    // On récupère l'index la matrice de projection
    parProgam.projMatrix = gl.getUniformLocation(parProgam, "proj");
    // On récupère l'index la matrice de vue
    parProgam.viewMatrix = gl.getUniformLocation(parProgam, "view");
    // On récupère l'index de la normal matrix
    parProgam.normalMatrix = gl.getUniformLocation(parProgam, "normalM");

    // On récupère l'index la matrice de modele
    parProgam.modelMatrix = gl.getUniformLocation(parProgam, "model");
}

function injectModelMatrix(parProgam, parModel)
{
    gl.uniformMatrix4fv(parProgam.modelMatrix , false, parModel);
}

function injectProjectionMatrix(parProgam, parProjection)
{
    gl.uniformMatrix4fv(parProgam.projMatrix , false, parProjection);
}

function injectView(parProgam, parView)
{
    gl.uniformMatrix4fv(parProgam.viewMatrix , false, parView);
}

function injectNormalMatrix(parProgam, parNormalMatrix)
{
    gl.uniformMatrix4fv(parProgam.normalMatrix , false, parNormalMatrix);
}

function injectMatrix(parProgam, parMatrixName, parMatrix)
{
	// Recuperation de l'id
	var matrixID =  gl.getUniformLocation(parProgam, parMatrixName);
    // Injection de la matrix
    gl.uniformMatrix4fv(matrixID, false, parMatrix);
}

function injectVec3(parProgam, parVec3Name, parVec3)
{
	// Recuperation de l'id
	var vecID =  gl.getUniformLocation(parProgam, parVec3Name);
    // Injection du vec3
    gl.uniform3fv(vecID, false, parVec3);
}

function injectVec3(parProgam, parVec4Name, parVec4)
{
	// Recuperation de l'id
	var vecID =  gl.getUniformLocation(parProgam, parVec4Name);
    // Injection du vec4
    gl.uniform3fv(vecID, false, parVec4);
}

function createBuffersVI(parObj, parVertexList, parIndexList)
{
   // Création du buffer de position
    var vertexPositionBuffer = gl.createBuffer();
    // On bind le buffer de position
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    //On copie les données sur ke GPU
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(parVertexList), gl.STATIC_DRAW);
    // 3 données par position
    vertexPositionBuffer.itemSize = 3;
    // Nombre de points
    vertexPositionBuffer.numItems = parVertexList.length / 3;
    // Copie dans la structure sphère
    parObj.vertexPositionBuffer = vertexPositionBuffer;

    // Création de l'IBO
    var vertexIndexBuffer = gl.createBuffer();
    // ON bind ke buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
    // ON copie les données sur le GPU
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STREAM_DRAW);
    // 3 Données par triangle
    vertexIndexBuffer.itemSize = 3;
    // Nombre d'indexes
    vertexIndexBuffer.numItems = indexData.length;
    // On copie dans la structure sphère
    parObj.vertexIndexBuffer = vertexIndexBuffer;
}

function createBuffersVINT(parObj, parVertexList, parIndexList, parNormalList, parTexCoordList)
{
   // Création du buffer de position
    var vertexPositionBuffer = gl.createBuffer();
    // On bind le buffer de position
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    //On copie les données sur ke GPU
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(parVertexList), gl.STATIC_DRAW);
    // 3 données par position
    vertexPositionBuffer.itemSize = 3;
    // Nombre de points
    vertexPositionBuffer.numItems = parVertexList.length / 3;
    // Copie dans la structure l'objet
    parObj.vertexPositionBuffer = vertexPositionBuffer;

    // Création de l'IBO
    var vertexIndexBuffer = gl.createBuffer();
    // ON bind ke buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
    // ON copie les données sur le GPU
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(parIndexList), gl.STREAM_DRAW);
    // 3 Données par triangle
    vertexIndexBuffer.itemSize = 3;
    // Nombre d'indexes
    vertexIndexBuffer.numItems = parIndexList.length;
    // On copie dans la structure l'objet
    parObj.vertexIndexBuffer = vertexIndexBuffer;

    var vertexNormalBuffer = gl.createBuffer();
    // On bind le VBO de normale
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    // On copie les données de normales sur le GPU
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(parNormalList), gl.STATIC_DRAW);
    // 3 Données par normale
    vertexNormalBuffer.itemSize = 3;
    // Nombre de normales
    vertexNormalBuffer.numItems = parNormalList.length / 3;
    // On le copie dans la structure l'objet
    parObj.vertexNormalBuffer = vertexNormalBuffer;

    // Création du de coordonnées texture
    var vertexTextureCoordBuffer = gl.createBuffer();
    // On bind le VBO uv mapping
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
    // On copie les données de texcoord sur le GPU
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(parTexCoordList), gl.STATIC_DRAW);
    // 2 données par tex coord
    vertexTextureCoordBuffer.itemSize = 2;
    // Nombre de tex coord
    vertexTextureCoordBuffer.numItems = parTexCoordList.length / 2;
    // On le copie dans la strcture de l'objet
    parObj.vertexTextureCoordBuffer = vertexTextureCoordBuffer;
}