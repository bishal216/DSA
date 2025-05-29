#pragma once
#include"HeaderFile.h"
#include<vector>
struct grid {
	sf::RectangleShape GRID;
	int COST;

	sf::String str;
	sf::Text txt;
	bool visited;
	int totalCost;

	sf::Vector2i lastIndex;
	bool wall;
};



class ShortestPath
{
	bool addWeight = true;
	//Variables
	static const int SIZE = 30;
	sf::Font font;
	sf::Text MatrixNum;

	grid G[SIZE][SIZE];
	bool start = false,finish = false;

	int lastTotalCost = 0;
	
	std::vector<sf::Vector2i> currentNodes, NextNodes;

	sf::Vector2i StartIndex,EndIndex,Currentpath;
	
	
	int i=0,j=0,k=0;

	

	//Functions
	sf::Text MaxtrixGrid[SIZE];
private:

public:
	void isClicked();


	ShortestPath();
	~ShortestPath();
	void AssignCost();

	void Djikatra();
	void FloydWarshall();


	void FindCurrentNode(int currentx,int currenty);
	void backtrack();
	void DRAW();


	void toggleWeight();
	void error();
	void SwapColors(int i,int j);
};

