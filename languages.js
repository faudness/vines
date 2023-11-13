// FR Language / Viewport support
if (location.hostname == "www.amazon.co.uk"){
    hiddenText=" Masqué(s)";
    filteredText=" Filtré(s)";
    filterMessage="Entrer le mot-clé / l'expression à masquer :";
    unfilterMessage="Entrer le mot-clé / l'expression à afficher :"
    highlightMessage="Entrer le mot-clé / l'expression à highlight:";
    unhighlightMessage="Entrer le mot-clé / l'expression à unhighlight:";
    filterText="Masquer le mot-clé / l'expression";
    unfilterText="Afficher le mot-clé / l'expression";
    highlightText="Highlight le mot-clé / l'expression";
    unhighlightText="Unhighlight le mot-clé / l'expression";
    menuText="Filtrés avancés";
    showMessage="Montrer les articles masqués / filtrés";
    hideMessage="Tout masquer sur cette page";
    unhideMessage="Tout afficher sur cette page";

    // For narrow viewport
    if (window.innerWidth < 1000){
        menuText="Avancés";
        showMessage="Afficher cachés";
        hideMessage="Tout cacher";
        unhideMessage="Tout afficher";
    }
}
