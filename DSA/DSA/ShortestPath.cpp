#include "ShortestPath.h"

bool ShortestPath::isClicked(sf::RectangleShape rshape)
{
	bool isHover;
	sf::Vector2i mPos = sf::Mouse::getPosition();
	sf::Vector2f rSize = rshape.getSize();
	sf::Vector2f rPos = rshape.getPosition();


	if (((mPos.x >= rPos.x) && (mPos.x <= (rPos.x + rSize.x))) && (mPos.y >= rPos.y) && (mPos.y <= (rPos.y + rSize.y)))
		isHover = true;
	else
		isHover = false;

	bool click = sf::Mouse::isButtonPressed(sf::Mouse::Button::Left);
	if (isHover == true && click == true)
		return true;
	else
		return false;
}

ShortestPath::ShortestPath()
{
	//LOAD FONTS
	font.loadFromFile("Fonts/ITIM.ttf");
	rr.loadFromFile("Textures/rr.png");
	
	for (int i = 0; i < SIZE; i++)
	{
		for (int j = 0; j < SIZE; j++)
		{
			GRID[i][j].setSize(sf::Vector2f(30, 30));
			GRID[i][j].setPosition(510 + 30 * i, 90 + j * 30);
			GRID[i][j].setOutlineColor(sf::Color::Black);
			GRID[i][j].setOutlineThickness(1.0f);
			GRID[i][j].setFillColor(sf::Color::Magenta);


			txt[i][j].setFont(font);
			txt[i][j].setPosition(510 + 30 * i, 90 + j * 30);
			txt[i][j].setCharacterSize(25);
			txt[i][j].setStyle(sf::Text::Bold);
			txt[i][j].setFillColor(sf::Color::Black);
		}
	}

	startButton.setSize(sf::Vector2f(350, 150));
	startButton.setTexture(&rr);
	startButton.setPosition(1500, 800);
	
	startText.setFont(font);
	startText.setPosition(1550, 820);
	startText.setCharacterSize(80);
	startText.setString("START");
	startText.setStyle(sf::Text::Bold);
	startText.setFillColor(sf::Color::Black);
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
			GRID[i][j].setFillColor(sf::Color::Magenta);
			COST[i][j] = std::rand() % 9 + 1;
			str[i][j] = std::to_string(COST[i][j]);
			txt[i][j].setString(str[i][j]);
			visited[i][j] = false;
		}
	}

	GRID[0][SIZE - 1].setFillColor(sf::Color::Red);
	GRID[SIZE - 1][0].setFillColor(sf::Color::Red);
	COST[0][SIZE -1] = 0 ;
	str[0][SIZE - 1] = "0";
	txt[0][SIZE - 1].setString(str[0][SIZE - 1]);
	visited[0][SIZE - 1] = true;
	start = false;

}

void ShortestPath::Djikatra()
{
	if (start == false)
	{
		if (isClicked(startButton))
			start = true;
	}
	DRAW();
}

void ShortestPath::FloydWarshall()
{
	DRAW();
}

void ShortestPath::DRAW()
{
	for (int i = 0; i < SIZE; i++)
	{
		for (int j = 0; j < SIZE; j++)
		{
			window.draw(GRID[i][j]);
			window.draw(txt[i][j]);
		}
	}
	window.draw(startButton);
	window.draw(startText);
}
