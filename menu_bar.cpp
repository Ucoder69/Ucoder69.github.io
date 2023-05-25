#include <Wt/WApplication.h>
#include <Wt/WContainerWidget.h>
#include <Wt/WMenu.h>
#include <Wt/WMenuItem.h>
#include <Wt/WText.h>

using namespace Wt;

class MyApplication : public WApplication
{
public:
    MyApplication(const WEnvironment& env) : WApplication(env)
    {
        // Create a container widget to hold the menu bar
        WContainerWidget* container = root();

        // Create a menu bar
        WMenu* menuBar = new WMenu(container);
        container->addWidget(menuBar);

        // Create menu items and add them to the menu bar
        WMenuItem* homeItem = menuBar->addItem("Home");
        WMenuItem* aboutItem = menuBar->addItem("About");
        WMenuItem* contactItem = menuBar->addItem("Contact");

        // Create a text widget to display selected menu item
        WText* contentText = new WText(container);
        container->addWidget(contentText);

        // Connect menu item signals to update content text
        homeItem->triggered().connect([=] {
            contentText->setText("Home page content goes here");
        });

        aboutItem->triggered().connect([=] {
            contentText->setText("Hello, i am a fellow programmer learning how to website);
        });

        contactItem->triggered().connect([=] {
            contentText->setText("Contact page content goes here");
        });
    }
};

int main(int argc, char** argv)
{
    // Create Wt application
    return WRun(argc, argv, [](const WEnvironment& env) {
        return new MyApplication(env);
    });
}
