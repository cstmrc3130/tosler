module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"
    ],
    theme: {
        extend: {
            backgroundImage: {
                'active-schedule': "url('https://img.freepik.com/free-vector/traveler-mountains-travel-journey-adventure-tourist-with-backpack-map-stand-rocky-landscape-look-into-distance-high-peak-extreme-hiking-lifestyle-cartoon-vector-illustration_107791-3999.jpg?w=1380&t=st=1677294736~exp=1677295336~hmac=7407fa3bae2db0b1f5d2c444e79fac79f82c11219632f9cbbf84850beecc9274')",
            }
        },
    },
    plugins: [
        require("daisyui"),
    ],
    daisyui: {
        styled: true,
        themes: ["light", "dark"],
        base: false,
        utils: true,
        logs: false,
        rtl: false,
        prefix: "",
        darkTheme: "dark",
    },
}
