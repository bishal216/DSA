cmake_minimum_required(VERSION 3.28)

project(CMakeSFMLProject LANGUAGES CXX)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

# Set assets directory
set(ASSETS_DIR ${CMAKE_SOURCE_DIR}/assets)

# Source files
set(SOURCES
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

# Determine platform
if(WIN32)
    message(STATUS "Configuring SFML via FetchContent (Windows)")

    include(FetchContent)
    FetchContent_Declare(SFML
        GIT_REPOSITORY https://github.com/SFML/SFML.git
        GIT_TAG 2.6.2
        GIT_SHALLOW ON
        EXCLUDE_FROM_ALL)
    FetchContent_MakeAvailable(SFML)

    set(SFML_LIBS SFML::Graphics SFML::Audio)

else()
    message(STATUS "Configuring SFML via find_package (Unix/Linux/macOS)")

    # Find system-installed SFML (install with: sudo apt install libsfml-dev)
    find_package(SFML 2.5 COMPONENTS graphics audio REQUIRED)

    set(SFML_LIBS sfml-graphics sfml-audio)
endif()

# Define executable
add_executable(main ${SOURCES})
target_compile_features(main PRIVATE cxx_std_17)

# Link SFML
target_link_libraries(main PRIVATE ${SFML_LIBS})

# Copy assets after build
add_custom_command(TARGET main POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    ${ASSETS_DIR} $<TARGET_FILE_DIR:main>/assets)