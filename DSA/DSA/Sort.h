#pragma once
#include "data.h"
class Sort :
    public data
{
private:
    linkedlist<int> smallList;

public:
    Sort();
    void randomize();
};

