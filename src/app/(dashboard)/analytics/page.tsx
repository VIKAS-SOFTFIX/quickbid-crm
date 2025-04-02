'use client';

import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Sample data - replace with real data from your API
const teamPerformance = [
  {
    name: 'Sarah Smith',
    leads: 150,
    converted: 45,
    conversionRate: 30,
    avgResponseTime: '2h',
  },
  {
    name: 'Mike Johnson',
    leads: 120,
    converted: 36,
    conversionRate: 30,
    avgResponseTime: '3h',
  },
  {
    name: 'Emily Brown',
    leads: 100,
    converted: 35,
    conversionRate: 35,
    avgResponseTime: '1.5h',
  },
];

const sourceData = [
  { name: 'Website', value: 35 },
  { name: 'Google Ads', value: 25 },
  { name: 'Facebook', value: 20 },
  { name: 'Instagram', value: 15 },
  { name: 'LinkedIn', value: 5 },
];

const monthlyData = [
  { month: 'Jan', leads: 65, converted: 20 },
  { month: 'Feb', leads: 75, converted: 25 },
  { month: 'Mar', leads: 85, converted: 30 },
  { month: 'Apr', leads: 90, converted: 35 },
  { month: 'May', leads: 100, converted: 40 },
  { month: 'Jun', leads: 110, converted: 45 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatCard = ({ title, value, subtitle }: any) => (
  <Paper sx={{ p: 2, height: '100%' }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4" component="div">
      {value}
    </Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Paper>
);

export default function AnalyticsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Analytics Dashboard
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Leads"
            value="1,234"
            subtitle="+12% from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Conversion Rate"
            value="32%"
            subtitle="+5% from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Response Time"
            value="2.5h"
            subtitle="-30min from last month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Team Performance"
            value="92%"
            subtitle="+3% from last month"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Lead Sources Distribution
            </Typography>
            <PieChart width={500} height={300}>
              <Pie
                data={sourceData}
                cx={250}
                cy={150}
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Monthly Lead Trends
            </Typography>
            <LineChart
              width={500}
              height={300}
              data={monthlyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#8884d8"
                name="Total Leads"
              />
              <Line
                type="monotone"
                dataKey="converted"
                stroke="#82ca9d"
                name="Converted Leads"
              />
            </LineChart>
          </Paper>
        </Grid>
      </Grid>

      {/* Team Performance Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Team Performance
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sales Representative</TableCell>
                <TableCell>Total Leads</TableCell>
                <TableCell>Converted</TableCell>
                <TableCell>Conversion Rate</TableCell>
                <TableCell>Avg Response Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teamPerformance.map((member) => (
                <TableRow key={member.name}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.leads}</TableCell>
                  <TableCell>{member.converted}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={member.conversionRate}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">
                          {member.conversionRate}%
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{member.avgResponseTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
} 