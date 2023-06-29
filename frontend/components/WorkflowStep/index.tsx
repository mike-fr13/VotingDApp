"use client";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Box,
} from "@chakra-ui/react";
import { EventContext } from "@/context/EventContext";
import React, { useContext } from "react";

export const steps = [
  { description: 'First',  title: 'Register Voters' },
  { description: 'Second', title: 'Register Prop start' },
  { description: 'Third',  title: 'Register Prop end' },
  { description: 'Fourth', title: 'Voting Session' },
  { description: 'Fifth',  title: 'Voting Closed' },
  { description: 'Sixth',  title: 'Votes Tallied' },
];

export const WorkflowStep = () => {
  const { currentWorkflowStatus } = useContext(EventContext);

  return (
    <Stepper size="sm" index={currentWorkflowStatus}>
      {steps.map((step, index) => (
        <Step key={index}>
          <StepIndicator>
            <StepStatus
              complete={<StepIcon />}
              incomplete={<StepNumber />}
              active={<StepNumber />}
            />
          </StepIndicator>

          <Box flexShrink="0">
            <StepTitle>{step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </Box>

          <StepSeparator />
        </Step>
      ))}
    </Stepper>
  );
};

export default WorkflowStep;
