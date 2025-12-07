import React from 'react';
import { View, Text } from 'react-native';

const PieChart = ({ categoryTotals }) => {
  // Prepare pie chart data
  const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
    x: category,
    y: Number(amount),
  }));

  // Color palette for category slices
  const colors = [
    '#24bafb', '#60a5fa', '#f472b6', '#fbbf24',
    '#34d399', '#8b5cf6', '#fb923c', '#10b981',
    '#ec4899', '#06b6d4', '#eab308', '#ef4444',
  ];

  if (pieData.length === 0) {
    return (
      <View style={{ padding: 16, alignItems: 'center' }}>
        <Text style={{ color: '#9ca3af', textAlign: 'center' }}>
          No expenses yet. Add some to see the chart.
        </Text>
      </View>
    );
  }

  // Calculate total for percentages
  const total = pieData.reduce((sum, item) => sum + item.y, 0);

  return (
    <View style={{ marginVertical: 16, paddingHorizontal: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 }}>
        Expenses by Category
      </Text>
      
      {/* Visual bar representation */}
      <View style={{ 
        backgroundColor: '#1f2937', 
        borderRadius: 8, 
        padding: 16,
        marginBottom: 16
      }}>
        {pieData.map((item, index) => {
          const percentage = (item.y / total) * 100;
          return (
            <View key={item.x} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: '#e5e7eb', fontSize: 14, fontWeight: '600' }}>
                  {item.x}
                </Text>
                <Text style={{ color: '#c2bfb6ff', fontWeight: '700' }}>
                  ${item.y.toFixed(2)}
                </Text>
              </View>
              <View style={{ 
                height: 8, 
                backgroundColor: '#374151', 
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <View
                  style={{
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: colors[index % colors.length],
                    borderRadius: 4,
                  }}
                />
              </View>
              <Text style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>
                {percentage.toFixed(1)}%
              </Text>
            </View>
          );
        })}
      </View>

      {/* Key */}
      <View style={{ marginTop: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 12 }}>
          Category Breakdown
        </Text>
        {pieData.map((item, index) => (
          <View
            key={item.x}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                backgroundColor: colors[index % colors.length],
                marginRight: 10,
              }}
            />
            <Text style={{ color: '#e5e7eb', fontSize: 13 }}>
              {item.x}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PieChart;
