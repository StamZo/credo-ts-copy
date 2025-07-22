import { Agent } from '@credo-ts/core'
import { getAgentOptions } from '../../core/tests/helpers'
import { getBesuIndyModules } from './indy-bese-test-utils'

describe('Minimal Agent Test', () => {
  it('should initialize agent without hanging', async () => {
    console.log('🧪 Testing agent initialization...')
    
    try {
      console.log('⚙️  Creating agent options...')
      const agentOptions = getAgentOptions(
        'MinimalAgent', 
        {
          endpoints: ['http://localhost:3001'],
        }, 
        {},
        getBesuIndyModules()
      )
      console.log('✅ Agent options created')

      console.log('🚀 Creating agent...')
      const agent = new Agent(agentOptions)
      console.log('✅ Agent created')

      console.log('📡 Initializing agent...')
      
      // Add timeout for initialization
      const initPromise = agent.initialize()
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Agent initialization timed out after 30 seconds'))
        }, 30000)
      })

      await Promise.race([initPromise, timeoutPromise])
      console.log('✅ Agent initialized successfully')

      console.log('🧹 Shutting down agent...')
      await agent.shutdown()
      console.log('✅ Agent shutdown complete')

      console.log('🎉 All tests passed!')
      
    } catch (error: any) {
      console.error('❌ Agent test failed:', error.message)
      console.error('Stack:', error.stack)
      throw error
    }
  }, 60000)
})