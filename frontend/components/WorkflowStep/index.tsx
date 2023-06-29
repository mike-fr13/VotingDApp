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
  { title: "Register Voters", description: "First" },
  { title: "Register Proposals", description: "Second" },
  { title: "Voting Session", description: "Third" },
  { title: "Voting Closed", description: "Fourth" },
  { title: "Votes Tallied", description: "Five" },
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
