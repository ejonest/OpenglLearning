#version 330 core

// Outputs colors in RGBA
out vec4 FragColor;


// Inputs the color from the Vertex Shader
in vec3 color;
// Inputs the texture coordinates from the Vertex Shader
in vec2 texCoord;
// Inputs from the Vertex shader for the normal and current postion
in vec3 Normal;
in vec3 crntPos;

// Gets the Texture Unit from the main function
uniform sampler2D tex0;

// Texture for specular lighting
uniform sampler2D tex1;

uniform vec4 lightColor;

uniform vec3 lightPos;
uniform vec3 camPos;


vec4 pointLight()
{

	vec3 lightVec = lightPos - crntPos;
	float dist = length(lightVec);
	float a = 3.0;
	float b = 0.7;
	// Modified inverse square equation. Utalizes a quadratic with constants a (quad) and b (linear) that are used
	// to adjust the intensity of the light over a distance.
	float inten = 1.0f / (a * dist * dist + b * dist + 1.0f);

	// Ambient light ensures everything in the scene is lit up at least a little
	float ambient = 0.20f;

	// Calculate the normals and diffuse lighting
	vec3 normal = normalize(Normal);
	vec3 lightDirection = normalize(lightVec);
	float diffuse = max(dot(normal, lightDirection), 0.0f);

	// Calculate the specular highlights and add them to the shader
	float specularLight = 0.50f;
	vec3 viewDirection = normalize(camPos - crntPos);
	vec3 reflectionDirection = reflect(-lightDirection, normal);
	float specAmount = pow(max(dot(viewDirection, reflectionDirection), 0.0f), 16);
	float specular = specAmount * specularLight;

	return (texture(tex0, texCoord) * (diffuse * inten + ambient) + texture(tex1, texCoord).r * specular * inten) * lightColor;
}

vec4 direcLight()
{
	// Ambient light ensures everything in the scene is lit up at least a little
	float ambient = 0.20f;

	// Calculate the normals and diffuse lighting
	vec3 normal = normalize(Normal);
	// Instead of the mathmatical function we used in pointLight we use a constant vec3 here to simulate the 
	// directional light. Due to the method of the return equation we must use a constant that is in the opposite
	// direction that we would like it to be in.
	vec3 lightDirection = normalize(vec3(1.0f, 1.0f, 0.0f));
	float diffuse = max(dot(normal, lightDirection), 0.0f);

	// Calculate the specular highlights and add them to the shader
	float specularLight = 0.50f;
	vec3 viewDirection = normalize(camPos - crntPos);
	vec3 reflectionDirection = reflect(-lightDirection, normal);
	float specAmount = pow(max(dot(viewDirection, reflectionDirection), 0.0f), 16);
	float specular = specAmount * specularLight;

	return (texture(tex0, texCoord) * (diffuse + ambient) + texture(tex1, texCoord).r * specular) * lightColor;
}

vec4 spotLight()
{
	// two cones so that the light is gradiant instead of constant. The constant light ends up looking like an old
	// school vidoe game where there is a highlighted circle beneath an object to draw attention. This is using
	// the efficent cos(angle) method instead of the inefficent form of storing the degree and calculating later
	float outerCone = 0.90f;
	float innerCone = 0.95f;

	// Ambient light ensures everything in the scene is lit up at least a little
	float ambient = 0.20f;

	// Calculate the normals and diffuse lighting
	vec3 normal = normalize(Normal);
	vec3 lightDirection = normalize(lightPos - crntPos);
	float diffuse = max(dot(normal, lightDirection), 0.0f);

	// Calculate the specular highlights and add them to the shader
	float specularLight = 0.50f;
	vec3 viewDirection = normalize(camPos - crntPos);
	vec3 reflectionDirection = reflect(-lightDirection, normal);
	float specAmount = pow(max(dot(viewDirection, reflectionDirection), 0.0f), 16);
	float specular = specAmount * specularLight;

	float angle = dot(vec3(0.0f, -1.0f, 0.0f), -lightDirection);
	float inten = clamp((angle - outerCone) / (innerCone - outerCone), 0.0f, 1.0f);

	return (texture(tex0, texCoord) * (diffuse * inten + ambient) + texture(tex1, texCoord).r * specular * inten) * lightColor;
}

void main()
{
	// Point light is the light we orginally used except we have now implemented a fade off ablity so that the light
	// disapates over the distance from the source.
	// FragColor = pointLight();

	// Directional light. This is similar to the sun. It is a far off lightsource that provides a large amount of light that
	// shows as parallel beams of light.
	// FragColor = direcLight();

	// Spot light. Similar to a flashlight this focuses the light in one or multiple cones to direct the light on anything 
	// in its path
	FragColor = spotLight();
}