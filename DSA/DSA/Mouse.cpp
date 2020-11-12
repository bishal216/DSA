
#include<SFML/Graphics.hpp>



//Hover

bool IsHover(sf::RectangleShape rect)
{
	sf::Vector2i mPos = sf::Mouse::getPosition();
	sf::Vector2f rSize = rect.getSize();
	sf::Vector2f rPos = rect.getPosition();


	if (((mPos.x >= rPos.x) && (mPos.x <= (rPos.x + rSize.x))) && (mPos.x >= rPos.x) && (mPos.y <= (rPos.y + rSize.y)))
		return true;
	else
		return false;
}

bool isClicked(sf::RectangleShape rect)
{
	bool hover = IsHover(rect);
	bool click = sf::Mouse::isButtonPressed(sf::Mouse::Button::Left);
	if (hover == true && click == true)
		return true;
	else
		return false;
}