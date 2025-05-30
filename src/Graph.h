#pragma once
#include"HeaderFile.h"
#include<math.h>
#include"linkedlist.h"
class Graph
{
	//variables
private:
	//Number of nodes
	static const int size = 500;
	//Position
	sf::Vector2f pts[size];
	//Draws nodes
	sf::CircleShape shape[size];
	//Connecting lines
	int linesize = 0;
	sf::Vertex verticex[2 * size];


	//For Prim
	linkedlist<int> Nodes,NotNodes;
	int startingPoint = -1;

	//For Krushkal
	int treeNumber[size];
	int treeCount = 0;


public:


	//functions

private:
	bool isHover(sf::CircleShape circle);
	bool isClicked(sf::CircleShape circle);

	float getdistance(sf::Vector2f p1, sf::Vector2f p2);
	void resetNodes();
public:
	Graph();
	~Graph();

	void update();



	void Prim();
	void Krushkal();

	void Shuffle();
};

