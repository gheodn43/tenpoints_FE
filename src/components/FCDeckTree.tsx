'use client';
import React, { useState } from 'react';

type Deck = {
  user_id: string;
  deck_path: string;
  deck_id: string;
  parent_deck_path: string | null;
  deck_name: string;
  new_count: number;
  learning_count: number;
  review_count: number;
  total_cards: number;
};

type TreeNode = {
  deck: Deck;
  children: TreeNode[];
  isExpanded: boolean;
};

const DeckTree = ({ decks }: { decks: Deck[] }) => {
  const buildTree = (): TreeNode[] => {
    const tree: { [key: string]: TreeNode } = {};

    // Xây dựng cây
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

    // Tìm root nodes (deck có parent là Null)
    return Object.values(tree).filter((node) => node.deck.parent_deck_path === null);
  };

  const [treeNodes, setTreeNodes] = useState<TreeNode[]>(buildTree());

  const toggleExpand = (node: TreeNode) => {
    node.isExpanded = !node.isExpanded;
    setTreeNodes([...treeNodes]);
  };

  const renderTree = (nodes: TreeNode[], level: number = 0) => {
    return nodes.map((node) => (
      <div key={node.deck.deck_id} style={{ marginLeft: level * 15 }}>
        <div className='flex justify-between items-center'>
          <div  className='cursor-pointer flex items-center responsive-font-small'>
            {node.children.length > 0 && (
              <span onClick={() => toggleExpand(node)} className='mr-2'>
                {node.isExpanded ? '-' : '+'}
              </span>
            )}
            <span className='hover:underline hover:text-primary'>{node.deck.deck_name}</span>
          </div>
          <div className='flex gap-3 responsive-font-small'>
            <span className='text-blue'>{node.deck.new_count}</span>
            <span className='text-red'>{node.deck.learning_count}</span>
            <span className='text-green'>{node.deck.review_count}</span>
            <span><i className="fa-solid fa-gear cursor-pointer"></i></span>
          </div>
        </div>
        {node.isExpanded && renderTree(node.children, level + 1)}
      </div>
    ));
  };

  return <div>{renderTree(treeNodes)}</div>;
};

export default DeckTree;
