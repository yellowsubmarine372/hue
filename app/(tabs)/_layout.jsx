import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'System',
        },
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: '#bbb',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'day') {
            iconName = focused ? 'ellipse' : 'ellipse-outline'
          } else if (route.name === 'week') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline'
          } else if (route.name === 'month') {
            iconName = focused ? 'calendar' : 'calendar-outline'
          }

          return <Ionicons name={iconName} size={20} color={color} />
        },
      })}
    >
      <Tabs.Screen name="day" options={{ title: 'Day' }} />
      <Tabs.Screen name="week" options={{ title: 'Week' }} />
      <Tabs.Screen name="month" options={{ title: 'Month' }} />
    </Tabs>
  )
}