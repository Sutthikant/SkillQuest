import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Lock, CheckCircle, Circle } from 'lucide-react';

const SkillTree = ({ skillData: propSkillData }) => {
  const [skillData, setSkillData] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  // Parse the JSON data from props or use default data
  useEffect(() => {
    if (propSkillData) {
      // If skillData is passed as prop, use it
      const parsedData = typeof propSkillData === 'string' 
        ? JSON.parse(propSkillData) 
        : propSkillData;
      
      // Check if the data has a 'tree' property (based on your API response format)
      const finalData = parsedData.tree ? JSON.parse(parsedData.tree) : parsedData;
      setSkillData(finalData);
    }
  }, [propSkillData]);

  const toggleNode = (nodeName) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeName)) {
      newExpanded.delete(nodeName);
    } else {
      newExpanded.add(nodeName);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleNodeCompletion = (nodeName, currentData) => {
    const updateNode = (node) => {
      if (node.name === nodeName) {
        return { ...node, done: !node.done };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNode)
        };
      }
      return node;
    };

    // Auto-complete parents when all children are completed
    const autoCompleteParents = (node) => {
      if (node.children && node.children.length > 0) {
        const updatedChildren = node.children.map(autoCompleteParents);
        const allChildrenComplete = updatedChildren.every(child => child.done);
        
        return {
          ...node,
          children: updatedChildren,
          done: allChildrenComplete || node.done
        };
      }
      return node;
    };

    const updatedData = updateNode(currentData);
    const finalData = autoCompleteParents(updatedData);
    
    setSkillData(finalData);
  };

  const isNodeUnlocked = (node, allNodes) => {
    if (node.prerequisites.length === 0) {
      return true;
    }

    const findNodeByName = (nodes, name) => {
      for (const n of nodes) {
        if (n.name === name) return n;
        if (n.children) {
          const found = findNodeByName(n.children, name);
          if (found) return found;
        }
      }
      return null;
    };

    return node.prerequisites.every(prereq => {
      const prereqNode = findNodeByName([allNodes], prereq);
      return prereqNode && prereqNode.done;
    });
  };

  const areAllChildrenCompleted = (node) => {
    if (!node.children || node.children.length === 0) {
      return true;
    }
    return node.children.every(child => child.done && areAllChildrenCompleted(child));
  };

  const canCompleteNode = (node) => {
    return areAllChildrenCompleted(node);
  };

  const renderNode = (node, level = 0, parentCompleted = true) => {
    const isExpanded = expandedNodes.has(node.name);
    const hasChildren = node.children && node.children.length > 0;
    const isUnlocked = isNodeUnlocked(node, skillData);
    const canComplete = canCompleteNode(node);
    const isCompleted = node.done;

    return (
      <div key={node.name} className="mb-4">
        {/* Connection line for children */}
        {level > 0 && (
          <div className="flex items-center mb-2">
            <div className="w-4 h-px bg-gray-300 mr-2"></div>
            <div className="w-px h-4 bg-gray-300"></div>
          </div>
        )}
        
        {/* Node */}
        <div className={`relative`} style={{ marginLeft: `${level * 24}px` }}>
          {/* Vertical line for parent connection */}
          {level > 0 && (
            <div className="absolute top-0 w-px h-6 bg-gray-300" style={{ left: '-24px' }}></div>
          )}
          
          <div className={`
            flex items-center p-4 rounded-lg border-2 transition-all duration-200
            ${isCompleted ? 'bg-green-50 border-green-300' : ''}
            ${isUnlocked && !isCompleted ? 'bg-white border-gray-300 hover:border-blue-300' : ''}
            ${!isUnlocked ? 'bg-gray-50 border-gray-200' : ''}
          `}>
            {/* Expand/Collapse button */}
            {hasChildren && (
              <button
                onClick={() => toggleNode(node.name)}
                className="mr-3 p-1 hover:bg-gray-100 rounded"
                disabled={!isUnlocked}
              >
                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
            )}
            
            {/* Status icon - clickable */}
            <button
              onClick={() => isUnlocked && canComplete && toggleNodeCompletion(node.name, skillData)}
              className={`mr-3 p-1 rounded transition-colors ${
                isUnlocked && canComplete ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed'
              }`}
              disabled={!isUnlocked || !canComplete}
            >
              {!isUnlocked ? (
                <Lock size={20} className="text-gray-400" />
              ) : isCompleted ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <Circle size={20} className="text-gray-400 hover:text-blue-500" />
              )}
            </button>
            
            {/* Node content */}
            <div className="flex-1 justify-items-start">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className={`font-semibold ${!isUnlocked ? 'text-gray-400' : 'text-gray-800'}`}>
                    {node.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    node.quest_type === 'learning' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {node.quest_type}
                  </span>
                </div>
              </div>
              
              <p className={`text-sm mt-1 ${!isUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                {node.description}
              </p>
              
              {node.prerequisites.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500">Prerequisites: </span>
                  <span className="text-xs text-gray-600">
                    {node.prerequisites.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Children nodes */}
        {hasChildren && isExpanded && (
          <div className="mt-4">
            {node.children.map(child => renderNode(child, level + 1, isCompleted))}
          </div>
        )}
      </div>
    );
  };

  if (!skillData) {
    return <div className="p-4">Loading skill tree...</div>;
  }

  return (
    <div className="w-full h-screen bg-gray-50 overflow-auto">
      <div className="bg-white shadow-lg p-6 ">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{skillData.name} Skill Path</h1>
        <p className="text-gray-600 mb-8">Complete prerequisites to unlock new skills and advance your {skillData.name} journey</p>
        
        <div className="space-y-4">
          {renderNode(skillData)}
        </div>
      </div>
    </div>
  );
};

export default SkillTree;