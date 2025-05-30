#pragma once
#include"HeaderFile.h"
class SelectionScreen
{
//variables
	private:
		int option = -1;

		sf::Font font;
		sf::Texture rr;
		sf::RectangleShape rect[4];
		sf::String str[4] = { "SORT","SEARCH","TREE","GRAPH" };
		sf::Text txt[4];

		sf::RectangleShape SORT[7] , SEARCH[3] , TREE[3] , GRAPH[4];

		sf::String sortSTR[7] = { "INSERTION SORT","SELECTION SORT","QUICK SORT","MERGE SORT","SHELL SORT","RADIX SORT" , "HEAP SORT" };
		sf::String searchSTR[3] = { "LINEAR SEARCH","BINARY SEARCH","TREE SEARCH"};
		sf::String treeSTR[4] = { "BINARY TREE","AVL TREE","B- TREE","HOFFMAN TREE" };
		sf::String graphSTR[4] = { "PRIM'S \n ALGORITHM","KRUSHKAL'S \n ALGORITHM","DIJKSTRA'S \n ALGORITHM", "FLOYD-WARSHALL \n ALGORITHM" };
		
		sf::Text sortText[7],searchText[3],treeText[4],graphText[4];




	public:



//functions
	private:
		bool isHover(sf::RectangleShape rshape);
		bool isClicked(sf::RectangleShape rshape);
public:
		SelectionScreen();
		~SelectionScreen();

		void update();



		void sortOptions();
		void searchOptions();
		void treeOptions();
		void graphOptions();

};

