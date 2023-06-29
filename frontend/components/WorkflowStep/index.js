'use client'
import { Step, StepDescription, StepIcon, StepIndicator, StepNumber, StepSeparator, StepStatus, StepTitle, Stepper, useSteps, Box } from '@chakra-ui/react'
import React from 'react'

const steps = [
    { title: 'First', description: 'Register Voters' },
    { title: 'Second', description: 'Register Proposals' },
    { title: 'Third', description: 'Voting Session' },
    { title: 'Fourth', description: 'Voting Closed' },
    { title: 'Five', description: 'Votes Tallied' },
  ]
  
  export const  WorkflowStep = () => {
    const { activeStep } = useSteps({
      index: 1,
      count: steps.length,
    })
  
    return (
      <Stepper size="sm" index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
  
            <Box flexShrink='0'>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
  
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    )
  }
  
  export default WorkflowStep;