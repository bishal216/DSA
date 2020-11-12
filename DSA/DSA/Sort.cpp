#include "Sort.h"

Sort::Sort()
{
	makeList();
}

//Fisher and Yates' method
void Sort::randomize()
{
	linkedlist<int> temp = list;
	linkedlist<int> randomlist;
	while (temp.sizeoflist() != 0)
	{
		int k = std::rand() % temp.sizeoflist();
		randomlist.insertAtEnd(temp.itemat(k));
		temp.deleteitem(temp.itemat(k));
	}
	randomlist.print();
	std::cout << "The size of list is : " << randomlist.sizeoflist();

}
