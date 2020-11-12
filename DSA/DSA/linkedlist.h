#pragma once
#include<iostream>
template<class T>
struct node
{
    T data;
    node* next;
    node* prev;
};

template <class T>
class linkedlist
{
    private: 
        node<T>* HEAD = NULL;
        node<T>* TAIL = NULL;

    public:
        linkedlist();
        ~linkedlist();
        bool isEmpty();
        void insertAtStart(T item);
        void insertAtEnd(T item);
        void insertAfter(T item, T previousItem);
        void insertBefore(T item , T nextItem);

        void deleteAtStart();
        void deleteAtEnd();
        void deleteafter(T previousItem);
        void deleteBefore(T nextItem);

        void print();

        //NONSTANDARD FUNCTIONS
        void deleteitem(T item);
        int sizeoflist();
        T itemat(int k);
        void emptyList();

};


