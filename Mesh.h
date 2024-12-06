#ifndef MESH_CLASS_H
#define MESH_CLASS_H

#include<string>

#include"VAO.h"
#include"EBO.h"
#include"camera.h"
#include"texture.h"

class Mesh
{
public:

	std::vector <Vertex> verticies;
	std::vector <GLuint> indices;
	std::vector <Texture> textures;


	VAO VAO;

	Mesh(std::vector <Vertex>& vertices, std::vector <GLuint>& indices, std::vector <Texture>& textures);

	void Draw(Shader& shader, Camera& camera);
};

#endif 
