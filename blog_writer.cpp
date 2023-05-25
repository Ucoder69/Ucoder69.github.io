#include <iostream>
#include <fstream>
#include <string>

void createNewPost()
{
    std::string title, content;

    std::cout << "Enter the title of the blog post: ";
    std::getline(std::cin >> std::ws, title);

    std::cout << "Enter the content of the blog post (press Ctrl+D on a new line to finish):\n";
    std::getline(std::cin >> std::ws, content, '\0');

    std::string fileName = title + ".txt";

    std::ofstream file(fileName);
    if (file.is_open()) {
        file << content;
        file.close();
        std::cout << "Blog post saved successfully!\n";
    } else {
        std::cerr << "Failed to create blog post.\n";
    }
}

int main()
{
    createNewPost();

    return 0;
}
