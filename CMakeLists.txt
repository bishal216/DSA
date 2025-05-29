# Specify the minimum CMake version required
cmake_minimum_required(VERSION 3.28)

# Define the project name and programming language
project(CMakeSFMLProject LANGUAGES CXX)

# Set the output directory for the compiled executable
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

# Ignore pkg-config and not try to find it.
set(PKG_CONFIG_EXECUTABLE "")

# Include the FetchContent module for downloading external dependencies
include(FetchContent)

# Declare SFML as a dependency to be fetched from GitHub
FetchContent_Declare(SFML
    GIT_REPOSITORY https://github.com/SFML/SFML.git  # GitHub repository for SFML
    GIT_TAG 2.6.2                                   # Specific version/tag to use
    GIT_SHALLOW ON                                   # Perform a shallow clone (faster, less data)
    EXCLUDE_FROM_ALL                                 # Prevent automatic build unless explicitly requested
    SYSTEM)                                          # Mark the dependency as a system dependency (suppresses warnings)

# Make the SFML content available to the build
FetchContent_MakeAvailable(SFML)

# Define the main executable and its source file
add_executable(main
    src/main.cpp
    src/Sort.cpp
    src/ShortestPath.cpp
    src/SelectionScreen.cpp
    src/Search.cpp
    src/Mouse.cpp
    src/Graph.cpp
    src/linkedlist.cpp
    src/data.cpp
    )

# Require C++17 features for this target
target_compile_features(main PRIVATE cxx_std_17)

# Link the SFML Graphics module (automatically links required dependencies like Window and System)
target_link_libraries(main PRIVATE SFML::Graphics)

# Set the path to the assets directory
set(ASSETS_DIR ${CMAKE_SOURCE_DIR}/assets)

# Copy assets to the output directory
add_custom_command(TARGET main POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    ${ASSETS_DIR} $<TARGET_FILE_DIR:main>/assets)