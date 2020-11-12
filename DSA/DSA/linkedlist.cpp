#include "linkedlist.h"
template<class T>
inline linkedlist<T>::linkedlist()
{
	HEAD = NULL;
	TAIL = NULL;
}

template<class T>
linkedlist<T>::~linkedlist()
{
}

template<class T>
bool linkedlist<T>::isEmpty()
{
	return (HEAD == NULL);
}

template<class T>
void linkedlist<T>::insertAtStart(T item)
{
	node<T>* temp = new node<T>;
	temp->data = item;
	temp->next = HEAD;
	temp->prev = NULL;

	if (!isEmpty())
		HEAD->prev = temp;
	if (TAIL == NULL)
		TAIL = HEAD;
	HEAD = temp;
}

template<class T>
void linkedlist<T>::insertAtEnd(T item)
{
    node<T>* temp = new node<T>();
    temp->data = item;
    temp->next = NULL;

    if (isEmpty())
    {
        temp->prev = NULL;
        HEAD = temp;
		TAIL = HEAD;
		return;
    }

    TAIL->next = temp;
    temp->prev = TAIL;
    TAIL = temp;
}

template<class T>
void linkedlist<T>::insertAfter(T item, T previousItem)
{
	if (isEmpty())
	{
		std::cout << "List empty" << std::endl;
		return;
	}

	node<T>* pre_ptr = HEAD;
	while (pre_ptr->data != previousItem)
	{
		pre_ptr = pre_ptr->next;
		if (!pre_ptr) 
		{
			std::cout << "No such element" << std::endl;
			return;
		}
	}
	node<T>* post_ptr = pre_ptr->next;

	node<T>* temp = new node<T>();
	temp->data = item;
	temp->prev = pre_ptr;
	temp->next = post_ptr;

	//relocate
	pre_ptr->next = temp;
	post_ptr->prev = temp;

}

template<class T>
void linkedlist<T>::insertBefore(T item, T nextItem)
{
	if (isEmpty())
	{
		std::cout << "List empty" << std::endl;
		return;
	}

	node<T>* post_ptr = TAIL;
	while (post_ptr->data != nextItem)
	{
		post_ptr = post_ptr->prev;
		if (!post_ptr) {
			std::cout << "No such element" << std::endl;
			return;
		}
	}
	node<T>* pre_ptr = post_ptr->prev;

	node<T>* temp = new node<T>();
	temp->data = item;
	temp->prev = pre_ptr;
	temp->next = post_ptr;

	pre_ptr->next = temp;
	post_ptr->prev = temp;


}

template<class T>
void linkedlist<T>::deleteAtStart()
{
	if (isEmpty())
	{
		std::cout << "List empty" << std::endl;
		return;
	}
	node<T>* ptr = HEAD;
	node<T>* postptr = ptr->next;
	if (postptr == NULL)
	{
		HEAD = NULL;
		TAIL = NULL;
		return;
	}
	postptr->prev = NULL;
	HEAD = postptr;
	delete ptr;
}

template<class T>
void linkedlist<T>::deleteAtEnd()
{
	if (isEmpty())
	{
		std::cout << "List empty" << std::endl;
		return;
	}
	node<T>* ptr = TAIL;
	node<T>* preptr = ptr->prev;
	if (preptr == NULL)
	{
		HEAD = NULL;
		TAIL = NULL;
		return;
	}
	preptr->next = NULL;
	TAIL = preptr;
	delete ptr;
}

template<class T>
void linkedlist<T>::deleteafter(T previousItem)
{
	if (isEmpty())
	{
		std::cout << "List empty" << std::endl;
		return;
	}

	node<T>* pre_ptr = HEAD;
	while (pre_ptr->data != previousItem)
	{
		pre_ptr = pre_ptr->next;
		if (!pre_ptr) {
			std::cout << "No such element" << std::endl;
			return;
		}
	}
	node<T>* temp = pre_ptr->next;
	if (temp == TAIL)
	{
		deleteAtEnd();
		return;
	}
	node<T>* postptr = temp->next;
	delete temp;
	pre_ptr->next = postptr;
	postptr->prev = pre_ptr;
}

template<class T>
void linkedlist<T>::deleteBefore(T nextItem)
{
	if (isEmpty())
	{
		std::cout << "List empty" << std::endl;
		return;
	}
	
	node<T>* post_ptr = TAIL;
	
	while (post_ptr->data != nextItem)
	{
		post_ptr = post_ptr->prev;
		if (!post_ptr) {
			std::cout << "No such element" << std::endl;
			return;
		}
	}

	node<T>* temp = post_ptr->prev;
	if (temp == HEAD)
	{
		deleteAtStart();
		return;
	}

	node<T>* pre_ptr = temp->prev;
	delete temp;
	pre_ptr->next = post_ptr;
	post_ptr->prev = pre_ptr;

}

template<class T>
void linkedlist<T>::print()
{
		node<T>* p = HEAD;
		while (p != NULL)
		{
			std::cout << p->data<<std::endl;
			p = p->next;
		}
		std::cout << std::endl;
}

template<class T>
void linkedlist<T>::deleteitem(T item)
{
	node<T>* ptr = new node<T>;
	ptr = HEAD;
	while (ptr!= NULL)
	{
		if (ptr->data == item)
		{
			if (ptr == HEAD)
			{
				deleteAtStart();
			}
			else if (ptr == TAIL)
			{
				deleteAtEnd();
			}
			else
			{
				node<T>* preptr = ptr->prev;
				deleteafter(preptr->data);
			}
	
			return;
		}
			
		ptr = ptr->next;
	}
	std::cout << "no such element" << std::endl;

}

template<class T>
int linkedlist<T>::sizeoflist()
{
	int i = 0;
	node<T>* temp = new node<T>;
	temp = HEAD;
	while (temp!= NULL)
	{
		i++;
		temp = temp->next;
	}
	delete temp;
	return i;
}

template<class T>
T linkedlist<T>::itemat(int k)
{
	T item;
	node<T>* temp = HEAD;
	for (int i = 0; i < k; i++)
		temp = temp->next;
	return temp->data;
}

template<class T>
void linkedlist<T>::emptyList()
{
	while (!isEmpty())
	{
		deleteAtEnd();
	}

}

template class linkedlist<int>;