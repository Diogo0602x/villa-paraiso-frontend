"use client"

import { Card, CardContent, Skeleton, Box } from "@mui/material"

interface CardSkeletonProps {
  height?: number
}

export function CardSkeleton({ height = 150 }: CardSkeletonProps) {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} />
        <Box mt={2}>
          <Skeleton variant="rectangular" height={height - 60} />
        </Box>
      </CardContent>
    </Card>
  )
}
