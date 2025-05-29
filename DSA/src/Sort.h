#pragma once
#include"HeaderFile.h"
#include"linkedlist.h"
#include<stack>

struct bar
{
    sf::RectangleShape rect;
    int value;
};




class Sort 
{
private:
    //SIZE
    //static const int SIZE = 100;
    static const int SIZE = 128;
    //DRAWING
    sf::RectangleShape outline;
    bar CHART[SIZE];
    
    bool start = false;
    
    //TO swap
    int count, prevCount,key;
    bool swapping = false;

    //For quicksort
    linkedlist<int> aux;

    //For MergeSort
        int _i, _j, _k;
        bool LoadOnce;
        linkedlist<int> L, R;

private:
   
    
public:
    Sort();
    ~Sort();
    void randomize();

    void insertionSort();
    void SelectionSort();

    //Iterative Variation
    void QuickSort(int low = 0, int high =SIZE-1);
    int partition(int low, int high);

    //Iterative Variation
    void MergeSort();
    void Merge(int left,int mid,int right);
    void Draw();

    void SwapValues(int i, int j);
    void SwapRectangle(int i,int j);
};

