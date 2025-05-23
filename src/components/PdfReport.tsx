import { Page, Text, View, Document, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';
import React from 'react';

// Types
interface CitySolution {
  path: string[];
  distance: number;
}

interface PdfDocumentProps {
  solution: CitySolution;
  graphImage?: string;
  matrix: number[][];
}

// Font registration
Font.register({
  family: 'Inter',
  fonts: [
    { 
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZg.ttf', 
      fontWeight: 400 
    },
    { 
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZg.ttf', 
      fontWeight: 600 
    },
    { 
      src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZg.ttf', 
      fontWeight: 700 
    },
  ],
});

// Modern color palette
const COLORS = {
  primary: '#3B82F6',      // blue-500
  primaryLight: '#93C5FD', // blue-300
  primaryDark: '#1D4ED8',  // blue-700
  secondary: '#10B981',    // emerald-500
  dark: '#1F2937',         // gray-800
  medium: '#6B7280',       // gray-500
  light: '#F3F4F6',        // gray-100
  white: '#FFFFFF',
  success: '#10B981',      // emerald-500
  warning: '#F59E0B',      // amber-500
  danger: '#EF4444',       // red-500
  info: '#60A5FA'          // blue-400
};

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    backgroundColor: COLORS.white,
    position: 'relative'
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: `1px solid ${COLORS.light}`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  headerText: {
    flex: 1
  },
  logo: {
    width: 80,
    height: 40,
    objectFit: 'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: COLORS.danger,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.medium,
    fontWeight: 400,
    letterSpacing: 0.5
  },
  resultContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.light,
    padding: 24,
    marginBottom: 30,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  },
  resultTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: COLORS.primary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleIcon: {
    marginRight: 8
  },
  pathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20
  },
  cityBadge: {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  arrowIcon: {
    fontSize: 10,
    color: COLORS.medium,
    marginHorizontal: 4
  },
  totalContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    width: '50%',
    marginTop: 16,
    display: 'flex',
    flexDirection: 'column'
  },
  totalTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: COLORS.white,
    marginBottom: 4,
    letterSpacing: 0.5
  },
  totalValueContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 700,
    color: COLORS.white,
    lineHeight: 1
  },
  totalUnit: {
    fontSize: 14,
    fontWeight: 400,
    color: COLORS.white,
    marginLeft: 8,
    lineHeight: 1.2
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.success,
    marginBottom: 16,
    marginTop: 32,
    paddingBottom: 8,
    borderBottom: `1px solid ${COLORS.light}`,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  graphContainer: {
    border: `1px solid ${COLORS.light}`,
    borderRadius: 8,
    padding: 16,
    backgroundColor: COLORS.white,
    marginBottom: 30,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  graphImage: {
    width: '100%',
    height: 360,
    objectFit: 'contain',
    borderRadius: 4
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 16,
    fontSize: 10
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8
  },
  legendLine: {
    width: 24,
    height: 3,
    marginRight: 8
  },
  matrixContainer: {
    border: `1px solid ${COLORS.light}`,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    marginBottom: 30,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  matrixTitle: {
    marginBottom: 16,
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.dark
  },
  matrixRow: {
    flexDirection: 'row',
    borderBottom: `1px solid ${COLORS.light}`
  },
  matrixHeaderCell: {
    width: 60,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 700,
    padding: 12,
    color: COLORS.white,
    backgroundColor: COLORS.primaryDark,
    borderRight: `1px solid ${COLORS.light}`
  },
  matrixFirstHeaderCell: {
    width: 100,
    textAlign: 'left',
    fontSize: 10,
    fontWeight: 700,
    padding: 12,
    paddingLeft: 16,
    color: COLORS.white,
    backgroundColor: COLORS.primaryDark,
    borderRight: `1px solid ${COLORS.light}`
  },
  matrixCell: {
    width: 60,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 400,
    padding: 12,
    borderRight: `1px solid ${COLORS.light}`,
    fontFamily: 'Inter'
  },
  matrixFirstCell: {
    width: 100,
    textAlign: 'left',
    fontSize: 10,
    fontWeight: 600,
    padding: 12,
    paddingLeft: 16,
    borderRight: `1px solid ${COLORS.light}`,
    color: COLORS.dark
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    color: COLORS.medium,
    textAlign: 'center',
    borderTop: `1px solid ${COLORS.light}`,
    paddingTop: 10
  },
  badge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 8
  },
  badgePrimary: {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primaryDark
  },
  badgeSuccess: {
    backgroundColor: '#D1FAE5',
    color: COLORS.success
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
    color: COLORS.warning
  },
  diagonalPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
    backgroundColor: COLORS.primary,
    transform: 'rotate(-45deg)'
  },
  watermark: {
    position: 'absolute',
    bottom: 100,
    right: 40,
    fontSize: 72,
    color: COLORS.light,
    fontWeight: 700,
    opacity: 0.1,
    transform: 'rotate(-15deg)'
  }
});

export const PdfDocument: React.FC<PdfDocumentProps> = ({ solution, graphImage, matrix }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const currentDate = new Date().toLocaleDateString(currentLanguage, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>TSP</Text>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>{t('pdf.title')}</Text>
            <Text style={styles.subtitle}>{t('Header.soustitle')}</Text>
          </View>
          <View>
            <Text style={styles.subtitle}>{currentDate}</Text>
          </View>
        </View>

        {/* Result Section */}
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>
            {t('result.title')}
          </Text>
          
          <View style={styles.pathContainer}>
            {solution.path.map((city: string, index: number) => (
              <React.Fragment key={index}>
                <Text style={styles.cityBadge}>
                  {city.length > 12 ? `${city.substring(0, 10)}...` : city}
                </Text>
                {index < solution.path.length - 1 && (
                  <Text style={styles.arrowIcon}>→</Text>
                )}
              </React.Fragment>
            ))}
          </View>
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalTitle}>{t('result.totalDistance')}</Text>
            <View style={styles.totalValueContainer}>
              <Text style={styles.totalValue}>{solution.distance}</Text>
              <Text style={styles.totalUnit}>{t('result.unite')}</Text>
            </View>
          </View>
        </View>

        {/* Graph Section */}
        {graphImage && (
          <View>
            <Text style={styles.sectionTitle}>
              {t('pdf.graph')}
            </Text>
            <View style={styles.graphContainer}>
              <Image 
                src={graphImage} 
                style={styles.graphImage} 
              />
              
              {/* Legend */}
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: COLORS.primary }]} />
                  <Text>{t('legend.depart')}</Text>
                </View>
                
                <View style={styles.legendItem}>
                  <View style={[styles.legendLine, { backgroundColor: COLORS.medium }]} />
                  <Text>{t('legend.possibleLink')}</Text>
                </View>
                
                <View style={styles.legendItem}>
                  <View style={[styles.legendLine, { 
                    backgroundColor: COLORS.danger,
                    borderBottomWidth: 2,
                    borderBottomColor: COLORS.danger,
                    borderBottomStyle: 'solid'
                  }]} />
                  <Text>{t('legend.optimalPath')}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Matrix Section */}
        <View>
          <Text style={styles.sectionTitle}>
            {t('pdf.matrix')}
          </Text>
          
          <View style={styles.matrixContainer}>
            {/* Column Headers */}
            <View style={[styles.matrixRow, { backgroundColor: COLORS.primaryDark }]}>
              <Text style={styles.matrixFirstHeaderCell}>
                {t('ville')}
              </Text>
              {solution.path.slice(0, -1).map((city: string, index: number) => (
                <Text 
                  key={`header-${index}`} 
                  style={styles.matrixHeaderCell}
                >
                  {city.substring(0, 3).toUpperCase()}
                </Text>
              ))}
            </View>

            {/* Matrix Rows */}
            {matrix.map((row: number[], rowIndex: number) => (
              <View 
                key={`row-${rowIndex}`} 
                style={[
                  styles.matrixRow,
                  { 
                    backgroundColor: rowIndex % 2 === 0 ? COLORS.white : COLORS.light,
                  }
                ]}
              >
                <Text style={styles.matrixFirstCell}>
                  {solution.path[rowIndex].length > 12 
                    ? `${solution.path[rowIndex].substring(0, 10)}...` 
                    : solution.path[rowIndex]}
                </Text>
                
                {row.map((cell: number, colIndex: number) => (
                  <Text
                    key={`cell-${rowIndex}-${colIndex}`}
                    style={[
                      styles.matrixCell,
                      { 
                        color: COLORS.dark,
                        ...(rowIndex === colIndex && { 
                          backgroundColor: COLORS.primaryLight,
                          fontWeight: 600,
                          color: COLORS.primaryDark
                        }),
                        ...(cell === Math.min(...row.filter((_, i) => i !== rowIndex)) && rowIndex !== colIndex && {
                          backgroundColor: '#FEF3C7',
                          color: COLORS.warning,
                          fontWeight: 600
                        })
                      }
                    ]}
                  >
                    {cell}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>
            &copy; {new Date().getFullYear()} Nirindrainy Sylvano Albertin • {t('droit')} • {currentDate}
          </Text>
        </View>
      </Page>
    </Document>
  );
};