import React, { useState, useEffect } from 'react'
import { View, Text, Button, Alert } from 'react-native'
import { 
    login, 
    fetchMonthlyTransactions, 
    createTransaction,
    fetchMonthlyMetrics 
} from './index'

// Example component showing API usage
export const ExampleAPIUsage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [transactions, setTransactions] = useState<any[]>([])
    const [metrics, setMetrics] = useState<any>(null)

    // Example login function
    const handleLogin = async () => {
        setIsLoading(true)
        try {
            const response = await login({
                email: 'user@example.com',
                password: 'password'
            })
            Alert.alert('Success', `Logged in with token: ${response.token}`)
        } catch (error) {
            Alert.alert('Error', 'Login failed')
            console.error('Login error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Example fetch transactions
    const handleFetchTransactions = async () => {
        setIsLoading(true)
        try {
            const data = await fetchMonthlyTransactions(2024, 1)
            setTransactions(data.transactions)
            Alert.alert('Success', `Fetched ${data.transactions.length} transactions`)
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch transactions')
            console.error('Fetch error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Example fetch metrics
    const handleFetchMetrics = async () => {
        setIsLoading(true)
        try {
            const data = await fetchMonthlyMetrics(2024, 1)
            setMetrics(data)
            Alert.alert('Success', `Total expenses: $${data.totalExpenses}`)
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch metrics')
            console.error('Metrics error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Example create transaction
    const handleCreateTransaction = async () => {
        setIsLoading(true)
        try {
            const newTransaction = await createTransaction({
                year: 2024,
                month: 1,
                date: '2024-01-15',
                amount: 25.50,
                description: 'Coffee',
                subcategory: { id: 1, name: 'Food', user: { id: '1', name: 'User', surname: 'Test', password: '', email: '', createdAt: '' } },
                isRecurring: false,
                notes: 'Morning coffee'
            })
            Alert.alert('Success', `Created transaction: ${newTransaction.description}`)
        } catch (error) {
            Alert.alert('Error', 'Failed to create transaction')
            console.error('Create error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                API Usage Examples
            </Text>

            <Button
                title={isLoading ? 'Loading...' : 'Login'}
                onPress={handleLogin}
                disabled={isLoading}
            />

            <View style={{ marginTop: 10 }}>
                <Button
                    title="Fetch Transactions"
                    onPress={handleFetchTransactions}
                    disabled={isLoading}
                />
            </View>

            <View style={{ marginTop: 10 }}>
                <Button
                    title="Fetch Metrics"
                    onPress={handleFetchMetrics}
                    disabled={isLoading}
                />
            </View>

            <View style={{ marginTop: 10 }}>
                <Button
                    title="Create Transaction"
                    onPress={handleCreateTransaction}
                    disabled={isLoading}
                />
            </View>

            {transactions.length > 0 && (
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>Transactions:</Text>
                    {transactions.map((tx, index) => (
                        <Text key={index}>
                            {tx.description}: ${tx.amount}
                        </Text>
                    ))}
                </View>
            )}

            {metrics && (
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontWeight: 'bold' }}>Metrics:</Text>
                    <Text>Total Income: ${metrics.totalIncome}</Text>
                    <Text>Total Expenses: ${metrics.totalExpenses}</Text>
                </View>
            )}
        </View>
    )
}
