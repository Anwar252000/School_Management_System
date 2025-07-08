# # Use the official .NET 8 runtime image
# FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
# WORKDIR /app
# EXPOSE 80

# # Use the official .NET 8 SDK image to build the app
# FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# WORKDIR /src
# COPY ["SchoolManagementSystem.sln", "."]
# COPY ["SchoolManagementSystem.API/SchoolManagementSystem.API.csproj", "SchoolManagementSystem.API/"]
# COPY ["SchoolManagementSystem.Application/SchoolManagementSystem.Application.csproj", "SchoolManagementSystem.Application/"]
# COPY ["SchoolManagementSystem.Domain/SchoolManagementSystem.Domain.csproj", "SchoolManagementSystem.Domain/"]
# COPY ["SchoolManagementSystem.Infrastructure/SchoolManagementSystem.Infrastructure.csproj", "SchoolManagementSystem.Infrastructure/"]
# COPY ["SchoolManagementSystem.Common/SchoolManagementSystem.Common.csproj", "SchoolManagementSystem.Common/"]
# RUN dotnet restore "SchoolManagementSystem.sln"

# # Copy the rest of the code
# COPY . .

# # Build the API project
# WORKDIR "/src/SchoolManagementSystem.API"
# RUN dotnet build "SchoolManagementSystem.API.csproj" -c Release -o /app/build

# # Publish the app
# FROM build AS publish
# RUN dotnet publish "SchoolManagementSystem.API.csproj" -c Release -o /app/publish

# # Final stage: copy the build artifacts and run the app
# FROM base AS final
# WORKDIR /app
# COPY --from=publish /app/publish .
# ENTRYPOINT ["dotnet", "SchoolManagementSystem.API.dll"]

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
EXPOSE 80

# Copy everything and publish
COPY ./Backend_API .
WORKDIR /src/SchoolManagementSystem.API
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SchoolManagementSystem.API.dll"]
