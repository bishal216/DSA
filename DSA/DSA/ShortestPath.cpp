#include "ShortestPath.h"
#include<algorithm>
void ShortestPath::isClicked()
{
	sf::Vector2i LmPos(-1,-1), RmPos(-1,-1) , MmPos(-1,-1);
	if (sf::Mouse::isButtonPressed(sf::Mouse::Button::Left) == true && StartIndex == sf::Vector2i(-1,-1))
		LmPos = sf::Mouse::getPosition();
		 
	if (sf::Mouse::isButtonPressed(sf::Mouse::Button::Right) == true && EndIndex == sf::Vector2i(-1,-1))
		RmPos = sf::Mouse::getPosition();

	if (sf::Mouse::isButtonPressed(sf::Mouse::Button::Middle) == true)
		MmPos = sf::Mouse::getPosition();
		 

	if (LmPos != sf::Vector2i(-1, -1))
	{
		int tempx = (LmPos.x - 510) / 30;
		int tempy = (LmPos.y - 90) / 30;

		if ((tempx >= 0 && tempx < SIZE) && (tempy >= 0 && tempy < SIZE))
			if (G[tempx][tempy].wall == false)
				StartIndex = sf::Vector2i(tempx, tempy);
	}
	if (RmPos != sf::Vector2i(-1, -1))
	{
		int tempx = (RmPos.x - 510) / 30;
		int tempy = (RmPos.y - 90) / 30;

		if ((tempx >= 0 && tempx < SIZE) && (tempy >= 0 && tempy < SIZE))
			if(G[tempx][tempy].wall == false)
				EndIndex = sf::Vector2i(tempx, tempy);
	}

	if (StartIndex != sf::Vector2i(-1, -1))
	{
		G[StartIndex.x][StartIndex.y].GRID.setFillColor(sf::Color::White);
		G[StartIndex.x][StartIndex.y].COST = 0;
		G[StartIndex.x][StartIndex.y].totalCost = 0;
		G[StartIndex.x][StartIndex.y].str = "0";
		G[StartIndex.x][StartIndex.y].txt.setString(sf::String("Act"));
		G[StartIndex.x][StartIndex.y].visited = true;
		currentNodes.push_back(sf::Vector2i(StartIndex.x, StartIndex.y));
	}

	if (EndIndex != sf::Vector2i(-1, -1))
	{
		G[EndIndex.x][EndIndex.y].GRID.setFillColor(sf::Color::Red);
		G[EndIndex.x][EndIndex.y].txt.setString(sf::String("End"));
		Currentpath = sf::Vector2i(EndIndex.x, EndIndex.y);
	}
	
	if (MmPos != sf::Vector2i(-1, -1))
	{
		int tempx = (MmPos.x - 510) / 30;
		int tempy = (MmPos.y - 90) / 30;
		if ((tempx >= 0 && tempx < SIZE) && (tempy >= 0 && tempy < SIZE))
		{
			if(StartIndex != sf::Vector2i(tempx,tempy) && EndIndex != sf::Vector2i(tempx, tempy))
			G[tempx][tempy].GRID.setFillColor(sf::Color::Black);
			G[tempx][tempy].COST = 1000;
			G[tempx][tempy].totalCost = 1000;
			G[tempx][tempy].str = " ";
			G[tempx][tempy].txt.setString(G[tempx][tempy].str);
			G[tempx][tempy].wall = true;
		}
	}

	if (StartIndex != sf::Vector2i(-1, -1) && EndIndex != sf::Vector2i(-1, -1))
		start = true;

}

ShortestPath::ShortestPath()
{
	//LOAD FONTS
	font.loadFromFile("Fonts/ITIM.ttf");
	
	for (int i = 0; i < SIZE; i++)
	{
		for (int j = 0; j < SIZE; j++)
		{
			G[i][j].GRID.setSize(sf::Vector2f(30, 30));
			G[i][j].GRID.setPosition(510 + 30 * i, 90 + j * 30);
			G[i][j].GRID.setOutlineColor(sf::Color::Black);
			G[i][j].GRID.setOutlineThickness(1.0f);
			G[i][j].GRID.setFillColor(sf::Color::Magenta);


			G[i][j].txt.setFont(font);
			G[i][j].txt.setPosition(510 + 30 * i, 90 + j * 30);
			G[i][j].txt.setCharacterSize(15);
			G[i][j].txt.setStyle(sf::Text::Bold);
			G[i][j].txt.setFillColor(sf::Color::Black);
		}
	}
	for (int i = 0; i < SIZE; i++)
	{
		MaxtrixGrid[i].setFont(font);
		MaxtrixGrid[i].setString(std::to_string(i));
		MaxtrixGrid[i].setCharacterSize(15);
	}
	MatrixNum.setFont(font);
	MatrixNum.setPosition(30,30);
	MatrixNum.setCharacterSize(50);
	MatrixNum.setStyle(sf::Text::Bold);
	MatrixNum.setFillColor(sf::Color::Red);

	AssignCost();
}

ShortestPath::~ShortestPath()
{
}

void ShortestPath::AssignCost()
{
	for (int i = 0; i < SIZE; i++)
	{
		for (int j = 0; j < SIZE; j++)
		{
			G[i][j].GRID.setFillColor(sf::Color::Magenta);
			G[i][j].COST = 1;
			if(addWeight == true)
				G[i][j].COST = std::rand() % 10+1;
			if (State == 18)
			{
				G[i][j].COST = std::rand() % 9;
				if (G[i][j].COST %2 == 0)
					G[i][j].COST = 1000;
			}
				
			G[i][j].str = std::to_string(G[i][j].COST);
			G[i][j].txt.setString(G[i][j].str);
			G[i][j].visited = false;

			G[i][j].totalCost = INT_MAX;
				
			G[i][j].lastIndex = sf::Vector2i(-1, -1);
			G[i][j].wall = false;
		}
	}
	

	start = false;
	finish = false;
	
	
	StartIndex = sf::Vector2i(-1, -1);
	EndIndex = sf::Vector2i(-1, -1);
	

	lastTotalCost = 0;

	currentNodes.clear();
	NextNodes.clear();
	

	Currentpath = sf::Vector2i(SIZE - 1, 0);

	k = 0;
}
void ShortestPath::Djikatra()
{
	if (start == false)
		isClicked();
	

	if (start== true && finish == false)
	{
		
		for (int i = 0; i < currentNodes.size(); i++)
		{
			sf::Vector2i temp= currentNodes.at(i);
			FindCurrentNode(temp.x, temp.y);
		}
			
		currentNodes.clear();
		currentNodes = NextNodes;
		NextNodes.clear();

		
	}

	if (start == true &&finish == false && currentNodes.size() == 0)
		error();

	if (finish == true)
		backtrack();

	DRAW();


}

void ShortestPath::FloydWarshall()
{
	if (start == false)
		for (int x = 0; x < SIZE; x++)
		{
			G[x][x].COST = 0;
			for (int y = 0;y < SIZE; y++)
			{
				G[x][y].totalCost = G[x][y].COST;
				if (G[x][y].totalCost <1000)
					G[x][y].str = std::to_string(G[x][y].totalCost);
				else
					G[x][y].str = "inf";
				G[x][y].txt.setString(G[x][y].str);
			}
			i = 0; j = 0; k = 0;
		}
	if(sf::Mouse::isButtonPressed(sf::Mouse::Button::Right))
		start = true;

	if (start == true && finish ==false)
	{
		
		G[i][j].totalCost = std::min(G[i][j].totalCost , G[i][k].totalCost + G[k][j].totalCost);
		if (G[i][j].totalCost < 1000)
			G[i][j].str = std::to_string(G[i][j].totalCost);
		else
			G[i][j].str = "inf";

		G[i][j].txt.setString(G[i][j].str);
		SwapColors(i, j);

		j++;
		if (j == SIZE) { j = 0; i++;}
		if (i == SIZE) { i = 0; k++; }
		if (k == SIZE)
			finish = true;
	}
	std::string str = "D" + std::to_string(k)+" : ";
	MatrixNum.setString(str);
	DRAW();


	for (int i = 0; i < SIZE; i++)
	{
		MaxtrixGrid[i].setPosition(G[i][0].GRID.getPosition().x, G[i][0].GRID.getPosition().y - 20);
		window.draw(MaxtrixGrid[i]);
		MaxtrixGrid[i].setPosition(G[0][i].GRID.getPosition().x-20, G[0][i].GRID.getPosition().y);
		window.draw(MaxtrixGrid[i]);
	}

	window.draw(MatrixNum);
}

void ShortestPath::FindCurrentNode(int currentx, int currenty)
{
	int tempx = currentx;
	int tempy = currenty;
	int currentTotalCost = G[currentx][currenty].totalCost;

	//top
	if (currenty != 0)
	{
		grid top = G[currentx][currenty - 1];
		if (currentTotalCost + top.COST < top.totalCost)
		{
			G[currentx][currenty - 1].totalCost = currentTotalCost + top.COST;
			G[currentx][currenty - 1].lastIndex = sf::Vector2i(currentx, currenty);
		}
			
		if (G[currentx][currenty - 1].visited == false && G[currentx][currenty - 1].wall == false)
			NextNodes.push_back(sf::Vector2i(currentx, currenty - 1));
	}

	//bottom
	if (currenty != SIZE-1)
	{
		int cost = G[currentx][currenty + 1].COST;
		if (currentTotalCost + cost < G[currentx][currenty + 1].totalCost)
		{
			G[currentx][currenty + 1].totalCost = currentTotalCost + cost;
			G[currentx][currenty + 1].lastIndex = sf::Vector2i(currentx, currenty);
		}
			
		if (G[currentx][currenty + 1].visited == false && G[currentx][currenty + 1].wall == false)
			NextNodes.push_back(sf::Vector2i(currentx, currenty + 1));
	}


	//left
	if (currentx != 0)
	{
		int cost = G[currentx-1][currenty].COST;
		if (currentTotalCost + cost < G[currentx - 1][currenty].totalCost)
		{
			G[currentx - 1][currenty].totalCost = currentTotalCost + cost;
			G[currentx - 1][currenty].lastIndex = sf::Vector2i(currentx, currenty);
		}
			
		if (G[currentx-1][currenty].visited == false && G[currentx - 1][currenty] .wall == false)
			NextNodes.push_back(sf::Vector2i(currentx - 1, currenty));
	}

	//right
	if (currentx != SIZE - 1)
	{
		int cost = G[currentx + 1][currenty].COST;
		if (currentTotalCost + cost < G[currentx + 1][currenty].totalCost)
		{
			G[currentx + 1][currenty].totalCost = currentTotalCost + cost;
			G[currentx + 1][currenty].lastIndex = sf::Vector2i(currentx, currenty);
		}
			
		if (G[currentx + 1][currenty].visited == false && G[currentx + 1][currenty].wall == false)
			NextNodes.push_back(sf::Vector2i(currentx + 1, currenty));
	}

		G[currentx][currenty].visited = true;
		G[currentx][currenty].GRID.setFillColor(sf::Color::Yellow);
		G[currentx][currenty].str = std::to_string(G[currentx][currenty].totalCost);
		if(StartIndex != sf::Vector2i(currentx,currenty) && EndIndex != sf::Vector2i(currentx, currenty))
			G[currentx][currenty].txt.setString(G[currentx][currenty].str);


		//delete repeated elements
		
		for (int i = 0; i < NextNodes.size(); i++)
		{
			sf::Vector2i temp = NextNodes.at(i);
			G[temp.x][temp.y].GRID.setFillColor(sf::Color::Cyan);
			for (int j = i+1; j < NextNodes.size(); j++)
			{
				sf::Vector2i temp2 = NextNodes.at(j);
				if (temp.x == temp2.x && temp.y == temp2.y)
					NextNodes.erase(NextNodes.begin()+j);
			}
		}

		if (State == 17 && G[EndIndex.x][EndIndex.y].visited == true)
			finish = true;

}

void ShortestPath::backtrack()
{
	if (Currentpath.x != -1 && Currentpath.y != -1)
	{
		G[Currentpath.x][Currentpath.y].GRID.setFillColor(sf::Color::Green);
		Currentpath = G[Currentpath.x][Currentpath.y].lastIndex;
	}
	
}
	

void ShortestPath::DRAW()
{
	for (int i = 0; i < SIZE; i++)
	{
		for (int j = 0; j < SIZE; j++)
		{
			
			window.draw(G[i][j].GRID);


			if (State == 18 || (finish == true && G[i][j].GRID.getFillColor()==sf::Color::Green) || (finish == false && addWeight == true))
				window.draw(G[i][j].txt);
		}
	}
	
}

void ShortestPath::toggleWeight()
{
	addWeight = !addWeight;
}

void ShortestPath::error()
{
	sf::Text text;
	text.setFont(font);
	text.setString(sf::String("CANNOT \n   FIND \n   PATH "));
	text.setPosition(1600, 450);
	text.setCharacterSize(50);
	text.setFillColor(sf::Color::White);
	text.setStyle(sf::Text::Bold);
	window.draw(text);
}

void ShortestPath::SwapColors(int i, int j)
{
	if(G[i][j].GRID.getFillColor() == sf::Color::Magenta)
		G[i][j].GRID.setFillColor(sf::Color::White);
	else
		G[i][j].GRID.setFillColor(sf::Color::Magenta);
}
