#include "Graph.h"

bool Graph::isHover(sf::CircleShape circle)
{
	sf::Vector2f mPos = (sf::Vector2f)sf::Mouse::getPosition();
	float rad = circle.getRadius();
	sf::Vector2f cPos =  circle.getPosition();

	float distance = getdistance(cPos, mPos);

	if (distance<rad)
		return true;
	else
		return false;
}

bool Graph::isClicked(sf::CircleShape circle)
{
	bool hover = isHover(circle);
	bool click = sf::Mouse::isButtonPressed(sf::Mouse::Button::Left);
	if (hover == true && click == true)
		return true;
	else
		return false;
}

float Graph::getdistance(sf::Vector2f p1, sf::Vector2f p2)
{
	float distance = sqrt(pow(p1.x - p2.x, 2) + pow(p1.y - p2.y, 2));
	return distance;
}

void Graph::resetNodes()
{
	for (int i = 0; i < size; i++)
	{
		pts[i].x = std::rand() % 1920;
		pts[i].y = std::rand() % 1080;
		shape[i].setPosition(pts[i]);

		verticex[2 * i].position = sf::Vector2f(0.0f, 0.0f);
		verticex[2 * i + 1].position = sf::Vector2f(0.0f, 0.0f);

		shape[i].setRadius(5.0f);
		shape[i].setOrigin(shape[i].getRadius(), shape[i].getRadius());
		shape[i].setFillColor(sf::Color(244, 44, 36, 255));
	}
}

Graph::Graph()
{

	for (int i = 0; i < 98; i++)
		verticex[i].color = sf::Color(255, 255, 255);

	for (int i = 0; i < size; i++)
		treeNumber[i] = -(i + 1);

	Shuffle();
}

Graph::~Graph()
{
}

void Graph::update()
{


}

void Graph::Prim()
{
	float mincost = INT_MAX;
	int newnode,lastnode;
	if (Nodes.isEmpty() == false && NotNodes.isEmpty()==false)
	{
		//Nodes.print();
		for (int j = 0; j < Nodes.sizeoflist(); j++)
		{
			int x = Nodes.itemat(j);
			shape[x].setFillColor(sf::Color(255, 255, 255, 255));

			for (int k = 0; k < NotNodes.sizeoflist(); k++)
			{
				int y = NotNodes.itemat(k);
				float cost = fabs(getdistance(pts[x], pts[y]));
				if (cost <= mincost)
				{
					mincost = cost;
					newnode = NotNodes.itemat(k);
					lastnode = Nodes.itemat(j);
				}
			}
		}
			Nodes.insertAtStart(newnode);
			NotNodes.deleteitem(newnode);

			verticex[linesize].position = pts[lastnode];
			linesize++;
			verticex[linesize].position = pts[newnode];
			linesize++;

			shape[newnode].setFillColor(sf::Color(255, 255, 0, 255));

	}
	if (startingPoint != -1)
	{
		shape[startingPoint].setFillColor(sf::Color(255, 255, 0, 255));
		shape[startingPoint].setRadius(7.0f);
		shape[startingPoint].setOrigin(shape[startingPoint].getRadius(), shape[startingPoint].getRadius());
	}


	for (int i = 0; i < size; i++)
	{
		if (Nodes.isEmpty() == true)
		{
			if (isHover(shape[i]) == true)
				shape[i].setFillColor(sf::Color(44, 44, 36, 255));
			else
				shape[i].setFillColor(sf::Color(244, 44, 36, 255));

			if (isClicked(shape[i]) == true)
			{
				Nodes.insertAtEnd(i);
				NotNodes.deleteitem(i);
				startingPoint = i;
			}
		}

		window.draw(shape[i]);
	}

	window.draw(verticex, 2*size -2, sf::Lines);


}
void Graph::Krushkal()
{
	float mincost = INT_MAX,cost = INT_MAX;
	int a = -1, b = -1;
		for (int j = 0; j < size; j++)
		{
			for (int k = 0; k < size; k++)
			{
				if(j!= k)
					cost = getdistance(pts[j], pts[k]);
				if (cost < mincost && (treeNumber[j] != treeNumber[k]))
				{
					mincost = cost;
					a = j;
					b = k;
				}
			}
		}
		if (a >= 0 && b >= 0)
		{
			int temp1 = treeNumber[a], temp2 = treeNumber[b];
			for (int i = 0; i < size; i++)
				if (treeNumber[i] == temp1 || treeNumber[i] == temp2)
					treeNumber[i] = treeCount;
			treeCount++;

			verticex[linesize].position = pts[a];
			linesize++;
			verticex[linesize].position = pts[b];
			linesize++;

			shape[a].setFillColor(sf::Color(255, 255, 0, 255));
			shape[b].setFillColor(sf::Color(255, 255, 0, 255));
		}
		for(int i = 0; i < size; i++){window.draw(shape[i]);}

	window.draw(verticex, 2 * size - 2, sf::Lines);
}
void Graph::Shuffle()
{

	linesize = 0;
	resetNodes();
	//PRIM
	startingPoint = -1;
	Nodes.emptyList();
	NotNodes.emptyList();
	for (int i = 0; i < size; i++) { NotNodes.insertAtEnd(i);}
	//KRUSHKAL
	treeCount = 0;
	for (int i = 0; i < size; i++){treeNumber[i] = -(i+1);}

}

