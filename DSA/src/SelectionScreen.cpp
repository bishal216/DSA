#include "SelectionScreen.h"



bool SelectionScreen::isHover(sf::RectangleShape rshape)
{
	sf::Vector2i mPos = sf::Mouse::getPosition();
	sf::Vector2f rSize = rshape.getSize();
	sf::Vector2f rPos = rshape.getPosition();


	if (((mPos.x >= rPos.x) && (mPos.x <= (rPos.x + rSize.x))) && (mPos.y >= rPos.y) && (mPos.y <= (rPos.y + rSize.y)))
		return true;
	else
		return false;
}

bool SelectionScreen::isClicked(sf::RectangleShape rshape)
{
	bool hover = isHover(rshape);
	bool click = sf::Mouse::isButtonPressed(sf::Mouse::Button::Left);
	if (hover == true && click == true)
		return true;
	else
		return false;
}

SelectionScreen::SelectionScreen()
{
	//LOAD FONTS
	font.loadFromFile("Fonts/ITIM.ttf");
	
	//LOAD TEXTURE(Rounded Rectangle)
	rr.loadFromFile("Textures/rr.png");

	//General 
	for (int i = 0; i < 4; i++)
	{
		rect[i].setSize(sf::Vector2f(350, 150));
		rect[i].setTexture(&rr);
		rect[i].setPosition(100, 200 * i + 125);

		txt[i].setFont(font);
		txt[i].setString(str[i]);
		txt[i].setPosition(240, 200 * i + 205);
		txt[i].setOrigin(70, 35);
		txt[i].setCharacterSize(50);
		txt[i].setStyle(sf::Text::Bold);
		
	}
	
	// Sort
	for (int i = 0; i < 7; i++)
	{
		SORT[i].setSize(sf::Vector2f(350, 150));
		SORT[i].setTexture(&rr);
		SORT[i].setPosition(1400, 200 * i + 125);

		sortText[i].setFont(font);
		sortText[i].setString(sortSTR[i]);
		sortText[i].setPosition(1500, 200 * i + 205);
		sortText[i].setOrigin(70, 35);
		sortText[i].setCharacterSize(30);
		sortText[i].setStyle(sf::Text::Bold);

	}
	
	// Graph
	for(int i=0;i<4;i++)
	{
		GRAPH[i].setSize(sf::Vector2f(350, 150));
		GRAPH[i].setTexture(&rr);
		GRAPH[i].setPosition(1400, 200 * i + 125);

		graphText[i].setFont(font);
		graphText[i].setString(graphSTR[i]);
		graphText[i].setPosition(1500, 200 * i + 205);
		graphText[i].setOrigin(70, 35);
		graphText[i].setCharacterSize(30);
		graphText[i].setStyle(sf::Text::Bold);

	}
	
}

SelectionScreen::~SelectionScreen()
{
}

void SelectionScreen::update()
{
	for (int i = 0; i < 4; i++)
	{//checkHover
		if (isHover(rect[i]) == true)
			txt[i].setFillColor(sf::Color(226, 43, 131));
		else
			txt[i].setFillColor(sf::Color(4,44,36,255));

		if (isClicked(rect[i]) == true)
			option = i;


		window.draw(rect[i]);
		window.draw(txt[i]);
	}
	switch (option)
	{
	case 0 :
		sortOptions();
		break;
	case 1 : 
		searchOptions();
		break;
	case 2:
		treeOptions();
		break;
	case 3:
		graphOptions();
		break;
	default:
		break;
	}	
}

void SelectionScreen::sortOptions()
{

	for (int i = 0; i < 7; i++)
	{
		//checkHover
		if (isHover(SORT[i]) == true)
			sortText[i].setFillColor(sf::Color(226, 43, 131));
		else
			sortText[i].setFillColor(sf::Color(4, 44, 36, 255));

		if (isClicked(SORT[i]) == true)
		{
			State = i+1;
		}
		if((WheelDelta > 0 && SORT[0].getPosition().y < 125) || (WheelDelta < 0 && SORT[6].getPosition().y >= 925))
		{
			SORT[i].setPosition(SORT[i].getPosition().x, SORT[i].getPosition().y + WheelDelta);
			sortText[i].setPosition(sortText[i].getPosition().x, sortText[i].getPosition().y + WheelDelta);
		}
		
		window.draw(SORT[i]);
		window.draw(sortText[i]);
	}
}

void SelectionScreen::searchOptions()
{
}

void SelectionScreen::treeOptions()
{
}

void SelectionScreen::graphOptions()
{
	for (int i = 0; i < 4; i++)
	{
		//checkHover
		if (isHover(GRAPH[i]) == true)
			graphText[i].setFillColor(sf::Color(226, 43, 131));
		else
			graphText[i].setFillColor(sf::Color(4, 44, 36, 255));

		if (isClicked(GRAPH[i]) == true)
		{

			State = i + 15;
		}
			


		window.draw(GRAPH[i]);
		window.draw(graphText[i]);
	}
}

