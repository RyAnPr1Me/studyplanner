import { Alert, Box, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import Loading from '../Common/Loading'

interface ToolRendererProps {
  code: string
  title?: string
}

const stripTypeScript = (source: string) => {
  let output = source
  output = output.replace(/interface\s+\w+\s*\{[\s\S]*?\}\s*/g, '')
  output = output.replace(/type\s+\w+\s*=\s*\{[\s\S]*?\};?\s*/g, '')
  output = output.replace(/: React\.FC(?:<[^>]+>)?/g, '')
  output = output.replace(/: [^=;]+(?=[,);])/g, '')
  output = output.replace(/useState<[^>]+>/g, 'useState')
  output = output.replace(/useEffect<[^>]+>/g, 'useEffect')
  return output
}

const ToolRenderer = ({ code, title }: ToolRendererProps) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sanitizedCode = useMemo(() => stripTypeScript(code), [code])

  useEffect(() => {
    let active = true

    const loadComponent = async () => {
      if (!code) {
        setComponent(null)
        return
      }
      setError(null)
      setComponent(null)

      const blob = new Blob([sanitizedCode], { type: 'text/javascript' })
      const url = URL.createObjectURL(blob)
      try {
        const module = await import(/* @vite-ignore */ url)
        if (active) {
          setComponent(() => module.default)
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to render tool')
        }
      } finally {
        URL.revokeObjectURL(url)
      }
    }

    void loadComponent()

    return () => {
      active = false
    }
  }, [code, sanitizedCode])

  return (
    <Box sx={{ border: '1px solid #e8eaed', borderRadius: 2, p: 2 }}>
      {title && (
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {title}
        </Typography>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {!error && !Component && <Loading />}
      {Component && <Component />}
    </Box>
  )
}

export default ToolRenderer
