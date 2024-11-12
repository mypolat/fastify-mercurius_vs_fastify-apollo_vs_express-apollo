#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting GraphQL Server Benchmark${NC}"

# Function to clean up processes
cleanup() {
    echo -e "\n${RED}Cleaning up processes...${NC}"
    kill $FASTIFY_MERCURIUS_PID 2>/dev/null
    kill $EXPRESS_APOLLO_PID 2>/dev/null
    kill $FASTIFY_APOLLO_PID 2>/dev/null
    exit
}

# Trap SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM

# Start servers
echo -e "${BLUE}Starting servers...${NC}"

echo "Starting Fastify + Mercurius server..."
PORT=3001 node dist/servers/fastify-mercurius.js &
FASTIFY_MERCURIUS_PID=$!
sleep 2

echo "Starting Express + Apollo server..."
PORT=3002 node dist/servers/express-apollo.js &
EXPRESS_APOLLO_PID=$!
sleep 2

echo "Starting Fastify + Apollo server..."
PORT=3003 node dist/servers/fastify-apollo.js &
FASTIFY_APOLLO_PID=$!
sleep 2

# Wait for servers to be ready
echo -e "${BLUE}Waiting for servers to be ready...${NC}"
sleep 5

# Function to run a specific test scenario
run_test() {
    local test_type=$1
    echo -e "\n${GREEN}Running $test_type test...${NC}"
    k6 run --tag testType=$test_type k6/load-test.js
}

# Run all test scenarios
echo -e "${BLUE}Starting tests...${NC}"

# Smoke test
run_test "smoke"

# Load test
run_test "load"

# Stress test
run_test "stress"

# Spike test
run_test "spike"

# Clean up
cleanup
