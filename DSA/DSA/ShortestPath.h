#pragma once
#include"HeaderFile.h"
class ShortestPath
{
	//Variables
	static const int SIZE = 30;
	sf::Font font;

	sf::RectangleShape GRID[SIZE][SIZE];
	int COST[SIZE][SIZE];
	sf::String str[SIZE][SIZE];
	sf::Text txt[SIZE][SIZE];
	
	sf::Texture rr;
	bool start = false;
	sf::RectangleShape startButton;
	sf::Text startText;

	bool visited[SIZE][SIZE];
	int totalCost[SIZE][SIZE];
	
	
	//Functions

private:

public:
	bool isClicked(sf::RectangleShape rshape);


	ShortestPath();
	~ShortestPath();
	void AssignCost();

	void Djikatra();
	void FloydWarshall();
	void DRAW();
};

