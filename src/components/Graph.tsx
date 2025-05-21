'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string;
  target: string;
  distance: number;
}

interface GraphProps {
  nodes: Node[];
  links: Link[];
  shortestPath: string[];
  shortestPathLinks: Link[]; // Ajoutez cette prop
}

const Graph: React.FC<GraphProps> = ({ nodes, links, shortestPath }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  console.log('Graph props:', { nodes, links, shortestPath });

  // Fonction pour mettre à jour les dimensions
  const updateDimensions = () => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: width || 800,
        height: 600
      });
    }
  };

  // Observer les changements de dimension
  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = dimensions.width;
    const height = dimensions.height;
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');


    // === Définition d'un filtre d'ombre et des marqueurs de flèche ===
    const defs = svg.append('defs');
    
    defs.html(`
      <filter id="drop-shadow" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="2" dy="2" result="offsetblur"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `);
    
    // Définir le marqueur de flèche séparément 
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', '22') 
      .attr('refY', '5')
      .attr('markerWidth', '8')
      .attr('markerHeight', '8')
      .attr('markerUnits', 'strokeWidth')  
      .attr('orient', 'auto-start-reverse')
      .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('fill', 'red');

    // === Force simulation ===
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1));

    const isInShortestPath = (source: any, target: any) => {
      const src = typeof source === 'object' ? source.id : source;
      const tgt = typeof target === 'object' ? target.id : target;

      for (let i = 0; i < shortestPath.length - 1; i++) {
        if (
          (shortestPath[i] === src && shortestPath[i + 1] === tgt)
        ) {
          return true;
        }
      }
      return false;
    };

    // === Liens ===
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', d => {
        const inShortestPath = isInShortestPath(d.source, d.target);
        return inShortestPath ? 'red' : '#ccc';
      })
      .attr('stroke-width', d => isInShortestPath(d.source, d.target) ? 2 : 1)
      .attr('stroke-dasharray', d => isInShortestPath(d.source, d.target) ? '5,5' : '0')
      .attr('marker-end', d => isInShortestPath(d.source, d.target) ? 'url(#arrow)' : null)
      .attr('fill', 'none');

    link.append('title').text(d => `Distance: ${d.distance}`);

    // === Étiquettes de distance ===
    svg.selectAll('.distance-label-bg')
      .data(links)
      .enter()
      .append('rect')
      .attr('class', 'distance-label-bg')
      .attr('width', 24)
      .attr('height', 14)
      .attr('fill', 'white')
      .attr('opacity', 0.7)
      .attr('rx', 3)
      .attr('ry', 3);

    svg.selectAll('.distance-label')
      .data(links)
      .enter()
      .append('text')
      .attr('class', 'distance-label')
      .text(d => d.distance.toString())
      .attr('font-size', '10px')
      .attr('fill', '#333')
      .attr('text-anchor', 'middle');


    // === Nœuds ===
    const nodeGroups = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    
    const startNodeId = shortestPath[0];
    const endNodeId = shortestPath[shortestPath.length - 1];

    nodeGroups.append('circle')
      .attr('r', 20)
      .attr('fill', d => {
        if (d.id === startNodeId) return '#2196F3'; // Bleu pour le départ
        if (d.id === endNodeId) return '#F44336';   // Rouge pour l'arrivée
        return '#4CAF50';                           // Vert pour les autres
      })
      .attr('stroke', d => {
        if (d.id === startNodeId) return '#0D47A1';
        if (d.id === endNodeId) return '#B71C1C';
        return '#2E7D32';
      })
      .attr('stroke-width', 2)
      .attr('filter', 'url(#drop-shadow)');

    nodeGroups.append('text')
      .text(d => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('fill', 'white')
      .attr('font-weight', 'bold');

    nodeGroups.append('title').text(d => `Ville: ${d.name}`);

    // === Légende ===
    const legend = svg.append('g').attr('transform', `translate(10, 10)`);
     // Ajout des couleurs pour départ/arrivée
    legend.append('circle').attr('cx', 0).attr('cy', 10).attr('r', 6).attr('fill', '#2196F3');
    legend.append('text').attr('x', 12).attr('y', 15).text('Départ').attr('font-size', '12px');

    legend.append('circle').attr('cx', 0).attr('cy', 30).attr('r', 6).attr('fill', '#F44336');
    legend.append('text').attr('x', 12).attr('y', 35).text('Arrivée').attr('font-size', '12px');

    legend.append('line')
      .attr('x1', 0).attr('y1', 50).attr('x2', 20).attr('y2', 50)
      .attr('stroke', '#ccc').attr('stroke-width', 1);

    legend.append('text')
      .attr('x', 25).attr('y', 54)
      .text('Lien possible')
      .attr('font-size', '12px')
      .attr('fill', '#333');

    legend.append('line')
      .attr('x1', 0).attr('y1', 70).attr('x2', 20).attr('y2', 70)
      .attr('stroke', 'red').attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('marker-end', 'url(#arrow)');  // Ajout du marqueur dans la légende

    legend.append('text')
      .attr('x', 25).attr('y', 74)
      .text('Chemin optimal')
      .attr('font-size', '12px')
      .attr('fill', '#333');

    // === Animation ===
    simulation.on('tick', () => {
      // Limiter les positions des nœuds pour qu'ils restent dans les limites du SVG
      nodes.forEach(node => {
        node.x = Math.max(40, Math.min(width - 40, node.x || 0));
        node.y = Math.max(40, Math.min(height - 40, node.y || 0));
      });

      link
        .attr('x1', d => getX(d.source))
        .attr('y1', d => getY(d.source))
        .attr('x2', d => getX(d.target))
        .attr('y2', d => getY(d.target));

      svg.selectAll<SVGRectElement, Link>('.distance-label-bg')
        .attr('x', d => (getX(d.source) + getX(d.target)) / 2 - 12)
        .attr('y', d => (getY(d.source) + getY(d.target)) / 2 - 7);

      svg.selectAll<SVGTextElement, Link>('.distance-label')
        .attr('x', d => (getX(d.source) + getX(d.target)) / 2)
        .attr('y', d => (getY(d.source) + getY(d.target)) / 2 + 3);

      nodeGroups.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // === Fonctions utilitaires ===
    function getX(d: any): number {
      if (typeof d === 'string') {
        const node = nodes.find(n => n.id === d);
        return node?.x ?? 0;
      }
      return d.x ?? 0;
    }

    function getY(d: any): number {
      if (typeof d === 'string') {
        const node = nodes.find(n => n.id === d);
        return node?.y ?? 0;
      }
      return d.y ?? 0;
    }

    



  }, [nodes, links, shortestPath, dimensions]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block', margin: '0 auto' }} />
    </div>
  );
};

export default Graph;