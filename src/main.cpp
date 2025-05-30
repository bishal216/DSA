#include"SelectionScreen.h"
#include"Graph.h"
#include"ShortestPath.h"
#include"Sort.h"
#include<thread>
sf::RenderWindow window(sf::VideoMode(1920, 1080), "My window",sf::Style::Fullscreen);
int State = 0;
int WheelDelta = 0;
int FPS = 60;
SelectionScreen SScr;
Graph g;
ShortestPath SP;
Sort sort;

int main()
{
   sf::Clock clock;
   //window.setVerticalSyncEnabled(true);
   while (window.isOpen())
   {
       if (State == 3)
           FPS = 10;
       else
           FPS = 60;
       window.setFramerateLimit(FPS);

       //RESET STATS
       window.clear(sf::Color(44,4,22,1));
       //SHOW FPS
       float currentTime = clock.restart().asSeconds();
       float fps = 1.f / (currentTime);
       std::cout << fps << std::endl;
       

       sf::Event event;
       while (window.pollEvent(event))
       {
           if (event.type == sf::Event::Closed)
               window.close();
           if (sf::Keyboard::isKeyPressed(sf::Keyboard::Escape))
               window.close();
           if (sf::Keyboard::isKeyPressed(sf::Keyboard::BackSpace))
           {
               if (State != 0)
               {
                   State = 0;
                   g.Shuffle();
                   SP.AssignCost();
                   sort.randomize();
               }
               
           }

           if (sf::Keyboard::isKeyPressed(sf::Keyboard::S))
           {
               if (State < 7 && State != 0)
                   sort.randomize();
               if(State == 15 || State == 16)
                    g.Shuffle();
               if (State == 17 || State == 18)
                   SP.AssignCost();
           }
           if ((event.type == sf::Event::KeyReleased) && (event.key.code == sf::Keyboard::T))
           {
               SP.toggleWeight();
               SP.AssignCost();
           }

           if (event.type == sf::Event::MouseWheelMoved)
           {
               // display number of ticks mouse wheel has moved
               WheelDelta = event.mouseWheel.delta;
           }


               
       }

       switch (State)
       {
       case 0:
           SScr.update();
           break;
       case 1:
           sort.insertionSort();
           break;
       case 2:
           sort.SelectionSort();
           break;
       case 3:
           sort.QuickSort();
           
           break;
       case 4:
           sort.MergeSort();
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
