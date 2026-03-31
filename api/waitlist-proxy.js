// api/waitlist-proxy.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const data = req.body
  if (!data.name || !data.email || !data.industry || !data.tier) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Log para debug (quitar en producción)
  console.log('New Morning Crew signup:', {
    name: data.name,
    email: data.email,
    tier: data.tier,
    industry: data.industry,
    timestamp: new Date().toISOString()
  })

  const WEBHOOK_URL = process.env.WAITLIST_WEBHOOK_URL
  const PILOT_LIMIT = parseInt(process.env.PILOT_LIMIT || '5', 10)

  let pilot_number = Math.floor(Math.random() * 100) + 1

  if (WEBHOOK_URL) {
    try {
      const webhookRes = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const webhookData = await webhookRes.json()
      if (webhookData.pilot_number) pilot_number = webhookData.pilot_number
    } catch (err) {
      console.error('Webhook error:', err.message)
      // Non-fatal — still return success to user
    }
  }

  return res.status(200).json({
    success: true,
    pilot_number,
    is_free_pilot: pilot_number <= PILOT_LIMIT,
    message: `You're pilot #${pilot_number}! Check your email for next steps.`
  })
}
