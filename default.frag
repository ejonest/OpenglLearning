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


void main()
{
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

	FragColor = (texture(tex0, texCoord) * (diffuse + ambient) + texture(tex1, texCoord).r * specular) * lightColor;
}