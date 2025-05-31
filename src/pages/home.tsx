import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { List, ArrowLeftRight, RotateCw, Square, GitBranch, RefreshCw, ArrowRightLeft } from 'lucide-react';

const Home = () => {
  const dataStructures = [
    {
      type: 'singly',
      title: 'Singly Linked List',
      description: 'Each node points to the next node in sequence',
      icon: <List className="w-8 h-8" />,
      color: 'from-blue-500 to-blue-600',
      path: '/singly'
    },
    {
      type: 'doubly',
      title: 'Doubly Linked List',
      description: 'Each node has pointers to both next and previous nodes',
      icon: <ArrowLeftRight className="w-8 h-8" />,
      color: 'from-purple-500 to-purple-600',
      path: '/doubly'
    },
    {
      type: 'circular',
      title: 'Circular Linked List',
      description: 'Last node points back to the first node, forming a circle',
      icon: <RotateCw className="w-8 h-8" />,
      color: 'from-green-500 to-green-600',
      path: '/circular'
    },
    {
      type: 'stack',
      title: 'Stack (LIFO)',
      description: 'Last In, First Out - Elements added and removed from top',
      icon: <Square className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      path: '/stack'
    },
    {
      type: 'queue',
      title: 'Queue (FIFO)',
      description: 'First In, First Out - Elements added at rear, removed from front',
      icon: <GitBranch className="w-8 h-8" />,
      color: 'from-cyan-500 to-blue-600',
      path: '/queue'
    },
    {
      type: 'circular-queue',
      title: 'Circular Queue',
      description: 'Fixed-size queue where rear wraps around to front',
      icon: <RefreshCw className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-600',
      path: '/circular-queue'
    },
    {
      type: 'deque',
      title: 'Double Ended Queue',
      description: 'Insert and remove elements from both front and rear',
      icon: <ArrowRightLeft className="w-8 h-8" />,
      color: 'from-violet-500 to-purple-600',
      path: '/deque'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Data Structure Visualizer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Interactive data structure visualization to help you understand different types of data structures and their operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {dataStructures.map((structure) => (
            <Card key={structure.type} className="hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${structure.color} flex items-center justify-center text-white mb-4`}>
                  {structure.icon}
                </div>
                <CardTitle className="text-2xl mb-2">{structure.title}</CardTitle>
                <p className="text-gray-600">{structure.description}</p>
              </CardHeader>
              <CardContent className="text-center">
                <Link to={structure.path}>
                  <Button className={`w-full bg-gradient-to-r ${structure.color} hover:opacity-90 text-white`}>
                    Explore {structure.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Learn Data Structures?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-lg mb-2">Dynamic Memory</h3>
                <p className="text-gray-600">Unlike arrays, these structures can grow and shrink during runtime</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Efficient Operations</h3>
                <p className="text-gray-600">Add, remove, or access elements with optimal time complexity</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Foundation Concepts</h3>
                <p className="text-gray-600">Essential building blocks for algorithms and software development</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;