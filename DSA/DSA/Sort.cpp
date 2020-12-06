#include "Sort.h"
#include <SFML/Graphics.hpp>
#include <algorithm>
#include <cstdlib>
#include <iostream>
#include <ostream>

Sort::Sort()
{
    randomize();


    outline.setPosition(sf::Vector2f(410, 40));
    //outline.setSize(sf::Vector2f(1000, 1000));
    outline.setSize(sf::Vector2f(10*SIZE,1000));
    outline.setFillColor(sf::Color::Black);
    outline.setOutlineColor(sf::Color::White);
    outline.setOutlineThickness(1.0f);

}

Sort::~Sort()
{
}


void Sort::randomize()
{
    for (int i = 0; i < SIZE; i++)
    {
        CHART[i].value = ((i + 1) * (1000/SIZE));
        CHART[i].rect.setPosition(sf::Vector2f(410 + 10 * i, 1040));
        CHART[i].rect.setSize(sf::Vector2f(8, CHART[i].value));
        CHART[i].rect.setFillColor(sf::Color::Magenta);
        CHART[i].rect.setOrigin(sf::Vector2f(0, CHART[i].rect.getSize().y));
    }
    for (int k = 0; k < SIZE; k++) 
    {
        //Fisher and Yates' method
        int r = k + rand() % (SIZE - k); // careful here!
        SwapValues(k,r);
        //SwapRectangle(k, r);
    }

    start = false;   
    swapping = false;

    L.emptyList();
    R.emptyList();
    
    
}

void Sort::insertionSort()
{

    if (start == false)
    {
        count = 1;                      //Main Iterator (For Pivot)
        prevCount = count - 1;          //Searches previous values to swap
        key = CHART[count].value;       //Value of pivot 
        if (sf::Mouse::isButtonPressed(sf::Mouse::Button::Right))
            start = true;
    }
       
    if (start == true && count<SIZE)
    {
            if (prevCount >= 0 && CHART[prevCount].value > key)
            {
                int j = prevCount;
                SwapValues(j + 1, j);
                //SwapRectangle(j, j + 1);
                prevCount--;
            }
            else {
                prevCount = count;
                count++;
                    
                if (count != SIZE)
                {
                    key = CHART[count].value;
                }
                    
            }
    }
    Draw();
}

void Sort::SelectionSort()
{

    if (start == false)
    {
        prevCount = 0;          //Main Iterator (For Pivot)
        key = 0;       //Returns smallest element
        if (sf::Mouse::isButtonPressed(sf::Mouse::Button::Right))
            start = true;
    }

    if (start == true && prevCount < SIZE)
    {
        int i, j, min_idx;

            // Find the minimum element in unsorted array  
            min_idx = prevCount;
            for (j = prevCount + 1; j < SIZE; j++)
                if (CHART[j].value < CHART[min_idx].value)
                    min_idx = j;

            // Swap the found minimum element with the first element  
            SwapValues(min_idx,prevCount);
            //SwapRectangle(min_idx, prevCount);
            key = min_idx;
            //CHART[min_idx].rect.setFillColor(sf::Color::Red);
            //CHART[prevCount].rect.setFillColor(sf::Color::Red);
            prevCount++;
             
    }
    Draw();
}

void Sort::QuickSort(int low, int high)
{
    if (start == false)
    {
        aux.emptyList();
        aux.insertAtEnd(low);
        aux.insertAtEnd(high);
        if (sf::Mouse::isButtonPressed(sf::Mouse::Button::Right))
            start = true;
    }
    if (start == true)
    {
        
        //--------RECURSIVE------------------
        //if (low < high) {
        //    /* Partitioning index */
        //    int p = partition(low, high);
        //    QuickSort(low, p - 1);
        //    QuickSort(p + 1, high);
        //}
            if (!aux.isEmpty())
            {
                int h = aux.TopnPop();
                int l = aux.TopnPop();
                int p = partition(l, h);
                if (p - 1 > l)
                {
                    aux.insertAtEnd(l);
                    aux.insertAtEnd(p - 1);
                }
                if (p + 1 < h)
                {
                    aux.insertAtEnd(p + 1);
                    aux.insertAtEnd(h);
                }
            }
       
    }
    Draw();
}
int Sort::partition(int low, int high)
{
    int pivot = CHART[high].value;
    int i = (low - 1);

    for (int j = low; j <= high - 1; j++) {
        if (CHART[j].value <= pivot)
            SwapValues(++i, j);
    }
    //FOR COLORING PURPOSE
        key = i + 1;
        prevCount = low;
        count = high;
    
    SwapValues(i + 1, high);
    return (i + 1);
}

void Sort::MergeSort()
{
    if (start == false)
    {
        count = 1; // Current Size of Subarray
        prevCount = 0; //Current startting index of Left SubArray
        LoadOnce = true;
        _i = 0;
        _j = 0;
        _k = 0;
        if (sf::Mouse::isButtonPressed(sf::Mouse::Button::Right))
            start = true;
    }
    if (start == true)
    {
        
        if (count <= SIZE - 1)
        {
            if (prevCount < SIZE - 1)
            {
                    swapping = true;
                    int x = prevCount + count - 1;
                    int y = SIZE - 1;
                    int mid = (x < y) ? x : y;
                   
                    x = prevCount + 2 * count - 1;
                    int right = (x < y) ? x : y;
                    //int mid = (prevCount + right) / 2;
                    Merge(prevCount, mid, right);
            }   
        }
        if (!swapping)
        {
            _i = 0;
            _j = 0;
            _k = 0;
            prevCount += 2 * count;
            if (prevCount >= SIZE - 1)
            {
                prevCount = 0;
                count *= 2;
            }
            LoadOnce = true;
            L.emptyList();
            R.emptyList();
        }
        
            
    }
    Draw();


}
void Sort::Merge(int left, int mid, int right)
{
    int Lsize = mid - left + 1;
    int Rsize = right - mid;
    if (LoadOnce)
    {
        
        /* Copy data to temp arrays L[] and R[] */
        for (int i = 0; i < Lsize; i++)
            L.insertAtEnd(CHART[left + i].value);
        for (int j = 0; j < Rsize; j++)
            R.insertAtEnd(CHART[mid + 1 + j].value);

        LoadOnce = false;
        _i = 0;
        _j = 0;
        _k = left;
    }
    else
    {
        /* Merge the temp arrays back into arr[l..r]*/
        if (_i < Lsize && _j < Rsize)
        {
            if (L.itemat(_i) <= R.itemat(_j))
            {
                CHART[_k].value = L.itemat(_i);
                CHART[_k].rect.setSize(sf::Vector2f(CHART[_k].rect.getSize().x, CHART[_k].value));
                CHART[_k].rect.setOrigin(0, CHART[_k].rect.getSize().y);
                _i++;
            }
            else
            {
                CHART[_k].value = R.itemat(_j);
                CHART[_k].rect.setSize(sf::Vector2f(CHART[_k].rect.getSize().x, CHART[_k].value));
                CHART[_k].rect.setOrigin(0, CHART[_k].rect.getSize().y);
                _j++;
            }
            _k++;
        }

        /* Copy the remaining elements of L[], if there are any */
        else if (_i < Lsize)
        {
            CHART[_k].value = L.itemat(_i);
            CHART[_k].rect.setSize(sf::Vector2f(CHART[_k].rect.getSize().x, CHART[_k].value));
            CHART[_k].rect.setOrigin(0, CHART[_k].rect.getSize().y);
            _i++;
            _k++;
        }

        /* Copy the remaining elements of R[], if there are any */
        else if (_j < Rsize)
        {
            CHART[_k].value = R.itemat(_j);
            CHART[_k].rect.setSize(sf::Vector2f(CHART[_k].rect.getSize().x, CHART[_k].value));
            CHART[_k].rect.setOrigin(0, CHART[_k].rect.getSize().y);
            _j++;
            _k++;
        }
        else
            swapping = false;
    }
}

void Sort::Draw()
{
    window.draw(outline);
    for (int i = 0; i < SIZE; i++)
    {
        if (State == 1)
        {
            if (i == prevCount + 1)
                CHART[i].rect.setFillColor(sf::Color::Cyan);
            else
                CHART[i].rect.setFillColor(sf::Color::Magenta);
        }
        if (State == 2)
        {
            if (i == prevCount || i == key)
                CHART[i].rect.setFillColor(sf::Color::Cyan);
            else
                CHART[i].rect.setFillColor(sf::Color::Magenta);
        }
        if (State == 3)
        {
            if (start == true && (i == count || i == prevCount))
                CHART[i].rect.setFillColor(sf::Color::Blue);
            else if (start == true && i == key)
                CHART[i].rect.setFillColor(sf::Color::Yellow);
            else
                CHART[i].rect.setFillColor(sf::Color::Magenta);
        }
        window.draw(CHART[i].rect);
       
    }
}


void Sort::SwapValues(int i, int j) 
{
    int temp = CHART[i].value;
    CHART[i].value = CHART[j].value;
    CHART[j].value = temp;

    SwapRectangle(i, j);
}

void Sort::SwapRectangle(int i,int j)
{
    sf::Vector2f firstValue = CHART[i].rect.getSize();
   sf::Vector2f secondValue = CHART[j].rect.getSize();
    CHART[i].rect.setSize(secondValue);
    CHART[i].rect.setOrigin(0, CHART[i].rect.getSize().y);
    CHART[j].rect.setSize(firstValue);
    CHART[j].rect.setOrigin(0, CHART[j].rect.getSize().y);

}
