#include"SelectionScreen.h"


#include"Graph.h"
#include"ShortestPath.h"

sf::RenderWindow window(sf::VideoMode(1920, 1080), "My window",sf::Style::Fullscreen);
int State = 0;
int main()
{
    sf::Clock clock;

     window.setVerticalSyncEnabled(true);
     SelectionScreen SScr;
     Graph g;
     ShortestPath SP;

     sf::Vertex vertices[] =
     {
         sf::Vertex(sf::Vector2f(0    ,    0), sf::Color(44,4,22), sf::Vector2f(0  ,  0)),
         sf::Vertex(sf::Vector2f(0    , 1080), sf::Color(34,4,22), sf::Vector2f(0  , 10)),
         sf::Vertex(sf::Vector2f(1920 , 1080), sf::Color(54,4,22), sf::Vector2f(10 ,  0)),
         sf::Vertex(sf::Vector2f(1920 ,    0), sf::Color(34,4,22), sf::Vector2f(10 , 10))
     };
     sf::Vertex verticex[] =
     {
         sf::Vertex(sf::Vector2f(0    ,    0), sf::Color(44,4,22), sf::Vector2f(0  ,  0)),
         sf::Vertex(sf::Vector2f(0    , 1080), sf::Color(34,4,22), sf::Vector2f(0  , 10)),
         sf::Vertex(sf::Vector2f(1920 , 1080), sf::Color(54,4,22), sf::Vector2f(10 ,  0)),
         sf::Vertex(sf::Vector2f(1920 ,    0), sf::Color(34,4,22), sf::Vector2f(10 , 10))
     };
     

     window.draw(vertices, 2, sf::Lines);

     
   while (window.isOpen())
   {
       window.clear(sf::Color(44,4,22,1));
       window.draw(vertices, 4, sf::Quads);
       float currentTime = clock.restart().asSeconds();
       float fps = 1.f / (currentTime);
       //std::cout << fps << std::endl;
       
       sf::Event event;
       while (window.pollEvent(event))
       {
           if (event.type == sf::Event::Closed)
               window.close();
           if (sf::Keyboard::isKeyPressed(sf::Keyboard::Escape))
               window.close();
           if (sf::Keyboard::isKeyPressed(sf::Keyboard::BackSpace))
           {
               State = 0;
               g.Shuffle();
               SP.AssignCost();
           }
               

           if (sf::Keyboard::isKeyPressed(sf::Keyboard::S))
               g.Shuffle();
       }

       switch (State)
       {
       case 0:
           SScr.update();
           break;
       case 15:
           g.Prim();
           break;
       case 16:
           g.Krushkal();
           break;
       case 17:
           SP.Djikatra();
           break;
       case 18:
           SP.FloydWarshall();
           break;
       default:
           break;
       }
       
      window.display();
   }
    return 0;
}



// draw it
