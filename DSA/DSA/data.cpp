#include "data.h"


//makes list from 1 to 1000
void data::makeList()
{
    for (int i = 1; i <= 1000; i++)
        list.insertAtEnd(i);
    //list.print();
    //std::cout << "The size of list is : " << list.sizeoflist();
}
