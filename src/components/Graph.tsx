'use client';

import React, { useEffect, useRef, useState, useContext } from 'react';
import * as d3 from 'd3';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '@/context/ThemeContext';

interface Node {
  id: string;
  name: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string | Node;
  target: string | Node;
  distance: number;
}

interface GraphProps {
  nodes: Node[];
  links: Link[];
  shortestPath: string[];
  shortestPathLinks: Link[]; 
}

const Graph: React.FC<GraphProps> = ({ nodes, links, shortestPath, shortestPathLinks }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);

  const getId = (d: string | Node): string => typeof d === 'object' ? d.id : d;

  const updateDimensions = () => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: width || 800,
        height: 600
      });
    }
  };

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

    const defs = svg.append('defs');
    
    const dropShadow = defs.append('filter')
      .attr('id', 'drop-shadow')
      .attr('height', '130%');

    dropShadow.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 3);

    dropShadow.append('feOffset')
      .attr('dx', 2)
      .attr('dy', 2)
      .attr('result', 'offsetblur');

    const merge = dropShadow.append('feMerge');
    merge.append('feMergeNode');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Updated arrow marker definition
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 26) // Increased refX to position arrow at the target node's edge
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', 'red');

    // Legend arrow marker (same definition but different ID)
    defs.append('marker')
      .attr('id', 'legend-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', 'red');

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1));

    const isInShortestPath = (source: string | Node, target: string | Node): boolean => {
      const src = getId(source);
      const tgt = getId(target);
      
      for (let i = 0; i < shortestPath.length - 1; i++) {
        if ((shortestPath[i] === src && shortestPath[i+1] === tgt) ||
            (shortestPath[i] === tgt && shortestPath[i+1] === src)) {
          return true;
        }
      }
      return false;
    };

    // Direction-aware shortest path check
    const isDirectedShortestPath = (source: string | Node, target: string | Node): boolean => {
      const src = getId(source);
      const tgt = getId(target);
      
      for (let i = 0; i < shortestPath.length - 1; i++) {
        if (shortestPath[i] === src && shortestPath[i+1] === tgt) {
          return true;
        }
      }
      return false;
    };

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', d => isInShortestPath(d.source, d.target) ? 'red' : '#ccc')
      .attr('stroke-width', d => isInShortestPath(d.source, d.target) ? 2 : 1)
      .attr('stroke-dasharray', d => isInShortestPath(d.source, d.target) ? '5,5' : '0')
      .attr('marker-end', d => isDirectedShortestPath(d.source, d.target) ? 'url(#arrow)' : 'none');

    link.append('title').text(d => `Distance: ${d.distance}`);

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
        if (d.id === startNodeId) return '#2196F3'; 
        if (d.id === endNodeId) return '#F44336';  
        return '#4CAF50';                           
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

    nodeGroups.append('title').text(d => `${t('ville')}: ${d.name}`);

    const legend = svg.append('g').attr('transform', `translate(10, 10)`);

    const textColor = theme === 'dark' ? '#eee' : '#333';
    const strokeColor = theme === 'dark' ? '#888' : '#ccc';

    legend.append('circle').attr('cx', 0).attr('cy', 10).attr('r', 6).attr('fill', '#2196F3');
    legend.append('text').attr('x', 12).attr('y', 15).text(t('legend.depart')).attr('font-size', '12px').attr('fill', textColor);

    legend.append('circle').attr('cx', 0).attr('cy', 30).attr('r', 6).attr('fill', '#F44336');
    legend.append('text').attr('x', 12).attr('y', 35).text(t('legend.arrival')).attr('font-size', '12px').attr('fill', textColor);

    legend.append('line').attr('x1', 0).attr('y1', 50).attr('x2', 20).attr('y2', 50).attr('stroke', strokeColor).attr('stroke-width', 1);
    legend.append('text').attr('x', 25).attr('y', 54).text(t('legend.possibleLink')).attr('font-size', '12px').attr('fill', textColor);

    // Updated legend line with marker-end
    legend.append('line')
      .attr('x1', 0).attr('y1', 70).attr('x2', 20).attr('y2', 70)
      .attr('stroke', 'red').attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('marker-end', 'url(#legend-arrow)');

    legend.append('text').attr('x', 25).attr('y', 74).text(t('legend.optimalPath')).attr('font-size', '12px').attr('fill', textColor);

    const getX = (d: string | Node): number => {
      if (typeof d === 'string') {
        const node = nodes.find(n => n.id === d);
        return node?.x ?? 0;
      }
      return d.x ?? 0;
    };

    const getY = (d: string | Node): number => {
      if (typeof d === 'string') {
        const node = nodes.find(n => n.id === d);
        return node?.y ?? 0;
      }
      return d.y ?? 0;
    };

    simulation.on('tick', () => {
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

    return () => {
      simulation.stop();
    };
  }, [nodes, links, shortestPath, dimensions, t, theme]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} style={{ display: 'block', margin: '0 auto' }} />
    </div>
  );
};

export default Graph;