'use client';
import React, { useState } from 'react';
import { Deck } from '@/db/deck.db';
import useDeckStatus from '@/hooks/useDeckStatus';

type TreeNode = {
  deck: Deck;
  children: TreeNode[];
  isExpanded: boolean;
};

const DeckTree = ({ decks }: { decks: Deck[] }) => {
  const buildTree = (): TreeNode[] => {
    const tree: { [key: string]: TreeNode } = {};
    decks.forEach((deck) => {
      if (!tree[deck.deck_path]) {
        tree[deck.deck_path] = { deck, children: [], isExpanded: false };
      }
      if (deck.parent_deck_path) {
        if (!tree[deck.parent_deck_path]) {
          tree[deck.parent_deck_path] = { deck: deck, children: [], isExpanded: false };
        }
        tree[deck.parent_deck_path].children.push(tree[deck.deck_path]);
      }
    });
    return Object.values(tree).filter((node) => node.deck.parent_deck_path === null);
  };

  const [treeNodes, setTreeNodes] = useState<TreeNode[]>(buildTree());
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');
  const { updateDeckName } = useDeckStatus();

  // Update deck paths for the node and its children
  const updateDeckPaths = (
    node: TreeNode,
    newParentDeckPath: string | null
  ): TreeNode => {
    const newDeckName = node.deck.deck_name;
    const newDeckPath = newParentDeckPath ? `${newParentDeckPath}::${newDeckName}` : newDeckName;
    // update UI
    node.deck.deck_path = newDeckPath;
    node.deck.parent_deck_path = newParentDeckPath;
    updateDeckName(node.deck);
    console.log(`deck_path: ${newDeckPath}, parent_deck_path: ${newParentDeckPath}`)
    // Update all children deck_path based on new deck_path of the current node
    node.children = node.children.map((child) =>
      updateDeckPaths(child, newDeckPath)
    );
    return node;
  };

  const handleRenameDeck = (node: TreeNode, newDeckName: string) => {
    node.deck.deck_name = newDeckName;
    const updatedNode = updateDeckPaths(node, node.deck.parent_deck_path);
    setTreeNodes([...treeNodes]);
  };

  const toggleExpand = (node: TreeNode) => {
    node.isExpanded = !node.isExpanded;
    setTreeNodes([...treeNodes]);
  };

  const handleRenameAction = (node: TreeNode) => {
    setSelectedNode(node);
    setRenameValue(node.deck.deck_name);
  };

  const handleRenameConfirm = () => {
    if (selectedNode) {
      if(renameValue && renameValue !== selectedNode.deck.deck_name){
        handleRenameDeck(selectedNode, renameValue);
        console.log('updated')
      }
        setRenameValue('');
        setSelectedNode(null);
    }
  };

  const handleDeleteAction = (node: TreeNode) => {
    setTreeNodes(treeNodes.filter((n) => n.deck.deck_id !== node.deck.deck_id));
    setSelectedNode(null);
  };

  const renderTree = (nodes: TreeNode[], level: number = 0) => {
    return nodes.map((node) => (
      <div key={node.deck.deck_id} style={{ marginLeft: level * 15, position: 'relative'}}>
        <div className="flex justify-between items-center">
          <div className="cursor-pointer flex items-center responsive-font-small">
            {node.children.length > 0 && (
              <span onClick={() => toggleExpand(node)} className="mr-2">
                {node.isExpanded ? '-' : '+'}
              </span>
            )}
            {selectedNode === node ? (
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={handleRenameConfirm}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameConfirm();
                  }
                }}
                autoFocus
                className="border p-1 rounded text-white responsive-font-small bg-black"
              />
            ) : (
              <div className='flex gap-3'>
                <span className="hover:underline hover:text-primary">{node.deck.deck_name}</span>
                <span className='text-sm text-primary'>
                  <i className="fa-solid fa-pen cursor-pointer" onClick={() => handleRenameAction(node)}></i>
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3 responsive-font-small">
            <span className="text-blue">{node.deck.new_count}</span>
            <span className="text-red">{node.deck.learning_count}</span>
            <span className="text-green">{node.deck.review_count}</span>
            <span className='text-primary'>
              <i className="fa-solid fa-trash cursor-pointer" onClick={() => handleDeleteAction(node)}></i>
            </span>
          </div>
        </div>
        {node.isExpanded && renderTree(node.children, level + 1)}
      </div>
    ));
  };

  return (
    <div>{renderTree(treeNodes)}</div>
  );
};

export default DeckTree;
