# Structures de Données en C — Guide Complet & Détaillé
# **Author:** *Yu-on B. A.*

> **Objectif** : Maîtriser toutes les notions en structure de donnée en c.  
> Chaque section = explication théorique + exemples annotés + exercice pratique + corrigé.

---

## TABLE DES MATIÈRES

1. [La Mémoire & les Adresses](#1-la-mémoire--les-adresses)
2. [Les Pointeurs](#2-les-pointeurs)
3. [Manipulation des Pointeurs](#3-manipulation-des-pointeurs)
4. [malloc & calloc — Allocation Dynamique](#4-malloc--calloc--allocation-dynamique)
5. [Tableaux Dynamiques](#5-tableaux-dynamiques)
6. [Listes Chaînées](#6-listes-chaînées)
7. [Piles (Stack)](#7-piles-stack)
8. [Files (Queue)](#8-files-queue)
9. [Arbres Binaires](#9-arbres-binaires)
10. [EXERCICES FINAUX](#10-exercices-finaux)

---

## 1. La Mémoire & les Adresses

### Concept fondamental

Quand tu déclares une variable en C, le compilateur réserve un espace en mémoire RAM. Cet espace a :
- Une **valeur** : le contenu stocké (ex: `42`)
- Une **adresse** : l'emplacement physique en mémoire (ex: `0x7ffd1a2b`)

```c
RAM (simplifié) :
┌──────────┬───────┐
│ Adresse  │ Valeur│
├──────────┼───────┤
│ 0x1000   │  42   │  ← int x = 42;
│ 0x1004   │  3.14 │  ← float y = 3.14;
│ 0x1008   │  'A'  │  ← char c = 'A';
└──────────┴───────┘
```

L'opérateur `&` donne l'adresse d'une variable :
```c
int x = 42;
printf("%p", &x);  // affiche quelque chose comme 0x7ffd1a2b
```

---

## 2. Les Pointeurs

### Qu'est-ce qu'un pointeur ?

Un **pointeur** est une variable dont la valeur est une adresse mémoire. Il "pointe" vers un autre emplacement mémoire.

```c
┌──────────┬──────────┐
│ Adresse  │  Valeur  │
├──────────┼──────────┤
│ 0x1000   │    42    │  ← int x = 42
│ 0x2000   │  0x1000  │  ← int *p = &x  (p contient l'adresse de x)
└──────────┴──────────┘
                       p pointe vers x : p → x
```

### Déclaration et syntaxe

```c
type *nom_pointeur;

int  *p;      // pointeur vers un entier
float *fp;    // pointeur vers un flottant
char  *cp;    // pointeur vers un caractère
```

### Les deux opérateurs clés
----------------------------------------------------------------
| Opérateur | Nom             | Rôle                           |
|-----------|-----------------|--------------------------------|
| `&`       | Adresse-de      | Donne l'adresse d'une variable |
| `*`       | Déréférencement | Accède à la valeur pointée     |
----------------------------------------------------------------

```c
int x = 42;
int *p = &x;   // p contient l'adresse de x

printf("%d", x);   // 42  (valeur directe)
printf("%p", p);   // 0x1000  (adresse stockée dans p)
printf("%d", *p);  // 42  (valeur à l'adresse pointée par p = déréférencement)

*p = 100;          // modifie x via le pointeur !
printf("%d", x);   // 100
```

### Pointeur NULL

Un pointeur non initialisé est dangereux. On utilise `NULL` pour indiquer "ne pointe nulle part" :

```c
int *p = NULL;

if (p != NULL) {
    printf("%d", *p);  // safe
}
// Ne JAMAIS déréférencer NULL → crash (segmentation fault)
```

### Exemple complet annoté

```c
#include <stdio.h>

int main() {
    int a = 10, b = 20;
    int *p1 = &a;
    int *p2 = &b;

    printf("a = %d, b = %d\n", a, b);         // a = 10, b = 20
    printf("*p1 = %d, *p2 = %d\n", *p1, *p2); // *p1 = 10, *p2 = 20

    // Échanger a et b via pointeurs
    int temp = *p1;
    *p1 = *p2;
    *p2 = temp;

    printf("Après échange :\n");
    printf("a = %d, b = %d\n", a, b);  // a = 20, b = 10

    return 0;
}
```

---

### Exercice 2.1

Écris une fonction `void inverse(int *x, int *y)` qui échange les valeurs de deux entiers en utilisant des pointeurs. Teste-la dans un `main`.

**Corrigé :**

```c
#include <stdio.h>

void inverse(int *x, int *y) {
    int temp = *x;  // sauvegarde la valeur pointée par x
    *x = *y;        // met la valeur de y dans x
    *y = temp;      // met l'ancienne valeur de x dans y
}

int main() {
    int a = 5, b = 9;
    printf("Avant : a=%d, b=%d\n", a, b);
    inverse(&a, &b);
    printf("Après : a=%d, b=%d\n", a, b);  // a=9, b=5
    return 0;
}
```

---

## 3. Manipulation des Pointeurs

### Arithmétique des pointeurs

Quand on incrémente un pointeur, il avance de `sizeof(type)` octets, pas de 1 octet :

```c
int tab[] = {10, 20, 30, 40};
int *p = tab;  // p pointe sur tab[0]

printf("%d\n", *p);      // 10
p++;                      // p avance de sizeof(int) = 4 octets
printf("%d\n", *p);      // 20
p++;
printf("%d\n", *p);      // 30

// Accès par index via pointeur
printf("%d\n", *(p+1));  // 40  (p+1 ne modifie pas p)
```

### Tableau et pointeur : relation profonde

En C, le nom d'un tableau **est** un pointeur vers son premier élément :

```c
int tab[5] = {1, 2, 3, 4, 5};

// Ces accès sont ÉQUIVALENTS :
tab[2]    == *(tab + 2)   // 3
&tab[0]   == tab          // même adresse
```

### Pointeur sur pointeur (`**`)

```c
int x = 42;
int *p = &x;    // p pointe vers x
int **pp = &p;  // pp pointe vers p

printf("%d\n", **pp);  // 42  (double déréférencement)
```

### Passage par pointeur vs par valeur

```c
// Par valeur : la fonction reçoit une COPIE → l'original n'est pas modifié
void doubleVal(int n) {
    n = n * 2;  // modifie la copie locale
}

// Par pointeur : la fonction reçoit l'ADRESSE → l'original est modifié
void doublePtr(int *n) {
    *n = *n * 2;  // modifie la valeur à l'adresse n
}

int main() {
    int a = 5;
    doubleVal(a);
    printf("%d\n", a);  // 5 (inchangé !)

    doublePtr(&a);
    printf("%d\n", a);  // 10 (modifié)
}
```

---

### Exercice 3.1

Écris une fonction `void minmax(int *tab, int taille, int *min, int *max)` qui trouve le minimum et le maximum d'un tableau d'entiers et les stocke via des pointeurs.

**Corrigé :**

```c
#include <stdio.h>

void minmax(int *tab, int taille, int *min, int *max) {
    *min = tab[0];
    *max = tab[0];
    for (int i = 1; i < taille; i++) {
        if (*(tab + i) < *min) *min = *(tab + i);
        if (*(tab + i) > *max) *max = *(tab + i);
    }
}

int main() {
    int t[] = {3, 7, 1, 9, 4, 2};
    int mn, mx;
    minmax(t, 6, &mn, &mx);
    printf("Min = %d, Max = %d\n", mn, mx);  // Min = 1, Max = 9
    return 0;
}
```

---

## 4. malloc & calloc — Allocation Dynamique

### Pourquoi l'allocation dynamique ?

Avec les tableaux classiques (`int tab[50]`), la taille est fixée **à la compilation**. Avec l'allocation dynamique, on réserve de la mémoire **pendant l'exécution** selon les besoins.

La mémoire allouée va dans le **tas (heap)**, pas dans la pile (stack).

### malloc — Memory ALLOCate

```c
#include <stdlib.h>

// Syntaxe :
void *malloc(size_t taille_en_octets);
// Retourne un pointeur void* vers le bloc alloué, ou NULL si échec.
```

```c
// Allouer un entier dynamiquement
int *p = (int*) malloc(sizeof(int));
if (p == NULL) {
    printf("Erreur d'allocation !\n");
    return 1;
}
*p = 42;
printf("%d\n", *p);
free(p);  // TOUJOURS libérer la mémoire !
p = NULL; // bonne pratique

// Allouer un tableau de 10 entiers
int *tab = (int*) malloc(10 * sizeof(int));
for (int i = 0; i < 10; i++) tab[i] = i * 2;
free(tab);
```

### calloc — Cleared ALLOCate

```c
void *calloc(size_t nb_elements, size_t taille_element);
// Alloue ET initialise tout à 0.
```

```c
int *tab = (int*) calloc(10, sizeof(int));
// tab[0]..tab[9] valent tous 0 automatiquement
// malloc n'initialise PAS → contient des "déchets" mémoire

free(tab);
```

### realloc — REALLOCate

```c
// Redimensionner un bloc alloué
int *tab = (int*) malloc(5 * sizeof(int));
tab = (int*) realloc(tab, 10 * sizeof(int));  // agrandir à 10
```

### free — Libération mémoire

```c
free(pointeur);  // libère le bloc alloué
// Ne JAMAIS :
//  - free deux fois le même pointeur → undefined behavior
//  - utiliser un pointeur après free → dangling pointer
```

### Schéma mémoire

```
Stack (pile) :        Heap (tas) :
┌────────────┐        ┌─────────────────┐
│ int *p     │──────► │    42           │  ← malloc(sizeof(int))
│ (adresse)  │        └─────────────────┘
└────────────┘
```

---

### Exercice 4.1

Écris un programme qui demande à l'utilisateur combien de notes il veut entrer (n), alloue dynamiquement un tableau de n flottants, lit les notes, calcule la moyenne, puis libère la mémoire.

**Corrigé :**

```c
#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    printf("Combien de notes ? ");
    scanf("%d", &n);

    float *notes = (float*) malloc(n * sizeof(float));
    if (notes == NULL) {
        printf("Erreur malloc\n");
        return 1;
    }

    for (int i = 0; i < n; i++) {
        printf("Note %d : ", i+1);
        scanf("%f", &notes[i]);
    }

    float somme = 0;
    for (int i = 0; i < n; i++) somme += notes[i];

    printf("Moyenne : %.2f\n", somme / n);

    free(notes);
    notes = NULL;
    return 0;
}
```

---

## 5. Tableaux Dynamiques

### Concept

Un tableau dynamique est un tableau dont la taille peut **grandir ou rétrécir** au runtime. On le gère avec une structure qui contient :
- Un pointeur vers les données
- La taille actuelle (nombre d'éléments)
- La capacité (nombre d'éléments max alloués)

```c
typedef struct {
    int *data;      // pointeur vers les données
    int taille;     // nombre d'éléments actuels
    int capacite;   // capacité allouée
} TableauDynamique;
```

### Opérations fondamentales

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    int taille;
    int capacite;
} TabDyn;

// Initialiser
TabDyn creer(int capacite_initiale) {
    TabDyn t;
    t.data = (int*) malloc(capacite_initiale * sizeof(int));
    t.taille = 0;
    t.capacite = capacite_initiale;
    return t;
}

// Ajouter un élément (avec redimensionnement si nécessaire)
void ajouter(TabDyn *t, int val) {
    if (t->taille == t->capacite) {
        // Doubler la capacité
        t->capacite *= 2;
        t->data = (int*) realloc(t->data, t->capacite * sizeof(int));
    }
    t->data[t->taille] = val;
    t->taille++;
}

// Afficher
void afficher(TabDyn *t) {
    printf("[");
    for (int i = 0; i < t->taille; i++) {
        printf("%d", t->data[i]);
        if (i < t->taille - 1) printf(", ");
    }
    printf("]\n");
}

// Libérer
void detruire(TabDyn *t) {
    free(t->data);
    t->data = NULL;
    t->taille = 0;
    t->capacite = 0;
}

int main() {
    TabDyn t = creer(4);
    ajouter(&t, 10);
    ajouter(&t, 20);
    ajouter(&t, 30);
    ajouter(&t, 40);
    ajouter(&t, 50);  // déclenche realloc
    afficher(&t);     // [10, 20, 30, 40, 50]
    detruire(&t);
    return 0;
}
```

---

### Exercice 5.1

Complète le tableau dynamique avec une fonction `supprimer_index(TabDyn *t, int i)` qui supprime l'élément à l'index `i` en décalant les éléments.

**Corrigé :**

```c
void supprimer_index(TabDyn *t, int i) {
    if (i < 0 || i >= t->taille) {
        printf("Index invalide\n");
        return;
    }
    // Décaler tous les éléments après i vers la gauche
    for (int j = i; j < t->taille - 1; j++) {
        t->data[j] = t->data[j + 1];
    }
    t->taille--;
}

// Test :
// TabDyn t = creer(5);
// ajouter 10, 20, 30, 40
// supprimer_index(&t, 1) → [10, 30, 40]
```

---

## 6. Listes Chaînées

### Concept

Une liste chaînée est une séquence de **nœuds** (nodes) où chaque nœud contient :
- Une **donnée**
- Un **pointeur** vers le nœud suivant

```
NULL ← [10|•] → [20|•] → [30|•] → NULL
        nœud1     nœud2     nœud3
```

L'avantage sur le tableau : insertion/suppression en O(1) sans décalage, taille dynamique vraiment flexible.

### Définition d'un nœud

```c
typedef struct Noeud {
    int data;
    struct Noeud *suivant;  // pointeur vers le prochain nœud
} Noeud;
```

### Création d'un nœud

```c
Noeud* creer_noeud(int val) {
    Noeud *n = (Noeud*) malloc(sizeof(Noeud));
    n->data = val;
    n->suivant = NULL;
    return n;
}
```

### Opérations complètes

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Noeud {
    int data;
    struct Noeud *suivant;
} Noeud;

// ─── Insertion en tête ───
// Avant : [20]→[30]→NULL   tete=20
// Après : [10]→[20]→[30]→NULL   tete=10
void inserer_tete(Noeud **tete, int val) {
    Noeud *n = (Noeud*) malloc(sizeof(Noeud));
    n->data = val;
    n->suivant = *tete;  // le nouveau nœud pointe vers l'ancienne tête
    *tete = n;           // la tête devient le nouveau nœud
}

// ─── Insertion en queue ───
void inserer_queue(Noeud **tete, int val) {
    Noeud *n = (Noeud*) malloc(sizeof(Noeud));
    n->data = val;
    n->suivant = NULL;

    if (*tete == NULL) {
        *tete = n;
        return;
    }

    Noeud *courant = *tete;
    while (courant->suivant != NULL)
        courant = courant->suivant;  // avancer jusqu'au dernier
    courant->suivant = n;
}

// ─── Suppression par valeur ───
void supprimer(Noeud **tete, int val) {
    if (*tete == NULL) return;

    // Si c'est la tête à supprimer
    if ((*tete)->data == val) {
        Noeud *tmp = *tete;
        *tete = (*tete)->suivant;
        free(tmp);
        return;
    }

    Noeud *courant = *tete;
    while (courant->suivant != NULL && courant->suivant->data != val)
        courant = courant->suivant;

    if (courant->suivant != NULL) {
        Noeud *tmp = courant->suivant;
        courant->suivant = tmp->suivant;
        free(tmp);
    }
}

// ─── Affichage ───
void afficher_liste(Noeud *tete) {
    while (tete != NULL) {
        printf("%d → ", tete->data);
        tete = tete->suivant;
    }
    printf("NULL\n");
}

// ─── Libération totale ───
void liberer_liste(Noeud **tete) {
    Noeud *courant = *tete;
    while (courant != NULL) {
        Noeud *tmp = courant;
        courant = courant->suivant;
        free(tmp);
    }
    *tete = NULL;
}

int main() {
    Noeud *liste = NULL;
    inserer_tete(&liste, 30);
    inserer_tete(&liste, 20);
    inserer_tete(&liste, 10);
    inserer_queue(&liste, 40);
    afficher_liste(liste);   // 10 → 20 → 30 → 40 → NULL
    supprimer(&liste, 20);
    afficher_liste(liste);   // 10 → 30 → 40 → NULL
    liberer_liste(&liste);
    return 0;
}
```

### Pourquoi `Noeud **tete` (double pointeur) ?

Parce que `tete` est un pointeur local à main. Pour que la fonction modifie **le pointeur lui-même** (pas juste la valeur pointée), on passe l'adresse du pointeur → `**`.

```
main:   tete → [10|•]→...
              ↑
inserer_tete(&tete, ...)  ← on passe l'adresse du pointeur tete
```

---

### Exercice 6.1

Écris une fonction `int longueur(Noeud *tete)` qui retourne le nombre de nœuds. Puis une fonction `void inverser(Noeud **tete)` qui inverse la liste en place.

**Corrigé :**

```c
int longueur(Noeud *tete) {
    int count = 0;
    while (tete != NULL) {
        count++;
        tete = tete->suivant;
    }
    return count;
}

void inverser(Noeud **tete) {
    Noeud *precedent = NULL;
    Noeud *courant = *tete;
    Noeud *suivant = NULL;

    while (courant != NULL) {
        suivant = courant->suivant;  // sauvegarder le suivant
        courant->suivant = precedent; // inverser le lien
        precedent = courant;          // avancer precedent
        courant = suivant;            // avancer courant
    }
    *tete = precedent;  // nouvelle tête = ancien dernier
}

// Test :
// 1 → 2 → 3 → NULL  devient  3 → 2 → 1 → NULL
```

---

## 7. Piles (Stack)

### Concept — LIFO (Last In, First Out)

Une pile fonctionne comme une pile d'assiettes : on empile par le dessus, on retire par le dessus. Le dernier entré est le premier sorti.

```
Empiler 10 :   [10]
Empiler 20 :   [20]  ← sommet
               [10]
Dépiler   :    retourne 20, reste [10]
```

### Opérations

| Opération | Description |
|-----------|-------------|
| `push(val)` | Empiler (ajouter au sommet) |
| `pop()` | Dépiler (retirer du sommet) |
| `peek()` | Lire le sommet sans retirer |
| `est_vide()` | Vérifier si la pile est vide |

### Implémentation avec liste chaînée

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Noeud {
    int data;
    struct Noeud *suivant;
} Noeud;

typedef struct {
    Noeud *sommet;
    int taille;
} Pile;

// Initialiser
Pile creer_pile() {
    Pile p;
    p.sommet = NULL;
    p.taille = 0;
    return p;
}

int est_vide(Pile *p) {
    return p->sommet == NULL;
}

// Push : insérer en tête = au sommet
void push(Pile *p, int val) {
    Noeud *n = (Noeud*) malloc(sizeof(Noeud));
    n->data = val;
    n->suivant = p->sommet;
    p->sommet = n;
    p->taille++;
}

// Pop : retirer la tête = le sommet
int pop(Pile *p) {
    if (est_vide(p)) {
        printf("Pile vide !\n");
        return -1;  // valeur sentinelle
    }
    Noeud *tmp = p->sommet;
    int val = tmp->data;
    p->sommet = tmp->suivant;
    free(tmp);
    p->taille--;
    return val;
}

// Peek : lire sans retirer
int peek(Pile *p) {
    if (est_vide(p)) {
        printf("Pile vide !\n");
        return -1;
    }
    return p->sommet->data;
}

void afficher_pile(Pile *p) {
    printf("Sommet → ");
    Noeud *courant = p->sommet;
    while (courant != NULL) {
        printf("[%d] ", courant->data);
        courant = courant->suivant;
    }
    printf("\n");
}

int main() {
    Pile p = creer_pile();
    push(&p, 10);
    push(&p, 20);
    push(&p, 30);
    afficher_pile(&p);     // Sommet → [30] [20] [10]
    printf("Pop: %d\n", pop(&p));  // 30
    printf("Peek: %d\n", peek(&p)); // 20
    afficher_pile(&p);     // Sommet → [20] [10]
    return 0;
}
```

### Application classique : vérification de parenthèses

```c
int verifier_parentheses(char *expr) {
    Pile p = creer_pile();
    for (int i = 0; expr[i] != '\0'; i++) {
        if (expr[i] == '(') push(&p, '(');
        else if (expr[i] == ')') {
            if (est_vide(&p)) return 0;  // fermante sans ouvrante
            pop(&p);
        }
    }
    return est_vide(&p);  // 1 si équilibré, 0 sinon
}
```

---

### Exercice 7.1

Écris une fonction qui utilise une pile pour inverser une chaîne de caractères.

**Corrigé :**

```c
// On adapte la pile pour stocker des char
typedef struct NoeudC {
    char data;
    struct NoeudC *suivant;
} NoeudC;

// ... (même logique push/pop mais avec char)

void inverser_chaine(char *s) {
    // Empiler tous les caractères
    Pile p = creer_pile();  // (adapté pour char)
    for (int i = 0; s[i] != '\0'; i++)
        push(&p, s[i]);  // (version char)

    // Dépiler dans l'ordre → chaîne inversée
    int i = 0;
    while (!est_vide(&p))
        s[i++] = pop(&p);
}

// "BONJOUR" → "RUOJNOB"
```

---

## 8. Files (Queue)

### Concept — FIFO (First In, First Out)

Une file fonctionne comme une file d'attente : le premier arrivé est le premier servi.

```
Enfiler 10 :  [10]
Enfiler 20 :  [10] → [20]
Enfiler 30 :  [10] → [20] → [30]
Défiler   :   retourne 10, reste [20] → [30]
```

### Opérations

| Opération      | Description                |
|----------------|----------------------------|
| `enfiler(val)` | Ajouter en queue           |
| `defiler()`    | Retirer en tête            |
| `front()`      | Lire la tête sans retirer  |
| `est_vide()`   | Vérifier si vide           |

### Implémentation avec liste chaînée (tête + queue)

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Noeud {
    int data;
    struct Noeud *suivant;
} Noeud;

typedef struct {
    Noeud *tete;   // où on défile (côté sortie)
    Noeud *queue;  // où on enfile (côté entrée)
    int taille;
} File;

File creer_file() {
    File f;
    f.tete = NULL;
    f.queue = NULL;
    f.taille = 0;
    return f;
}

int file_vide(File *f) {
    return f->tete == NULL;
}

// Enfiler : ajouter en queue
void enfiler(File *f, int val) {
    Noeud *n = (Noeud*) malloc(sizeof(Noeud));
    n->data = val;
    n->suivant = NULL;

    if (file_vide(f)) {
        f->tete = n;
        f->queue = n;
    } else {
        f->queue->suivant = n;
        f->queue = n;
    }
    f->taille++;
}

// Défiler : retirer en tête
int defiler(File *f) {
    if (file_vide(f)) {
        printf("File vide !\n");
        return -1;
    }
    Noeud *tmp = f->tete;
    int val = tmp->data;
    f->tete = tmp->suivant;
    if (f->tete == NULL) f->queue = NULL;  // file devenue vide
    free(tmp);
    f->taille--;
    return val;
}

int front(File *f) {
    if (file_vide(f)) return -1;
    return f->tete->data;
}

void afficher_file(File *f) {
    printf("Tête → ");
    Noeud *courant = f->tete;
    while (courant != NULL) {
        printf("[%d] ", courant->data);
        courant = courant->suivant;
    }
    printf("← Queue\n");
}

int main() {
    File f = creer_file();
    enfiler(&f, 10);
    enfiler(&f, 20);
    enfiler(&f, 30);
    afficher_file(&f);          // Tête → [10] [20] [30] ← Queue
    printf("Défile: %d\n", defiler(&f));  // 10
    printf("Front: %d\n", front(&f));     // 20
    afficher_file(&f);          // Tête → [20] [30] ← Queue
    return 0;
}
```

---

### Exercice 8.1

Simule une file d'attente de patients dans un cabinet médical. Chaque patient a un nom (chaîne). Enfile 3 patients, puis traite-les un à un.

**Corrigé :**

```c
// Adapter la File pour stocker des chaînes (char[50])
typedef struct Noeud {
    char nom[50];
    struct Noeud *suivant;
} Noeud;

// (même logique, remplacer int par char[50], utiliser strcpy)

// Dans main :
// enfiler(&f, "Alice");
// enfiler(&f, "Bob");
// enfiler(&f, "Charlie");
// while (!file_vide(&f)) {
//     printf("Traitement de : %s\n", defiler(&f));
// }
// → Traitement de : Alice
// → Traitement de : Bob
// → Traitement de : Charlie
```

---

## 9. Arbres Binaires

### Concept

Un arbre binaire est une structure hiérarchique où chaque **nœud** a au plus **deux fils** : un fils gauche et un fils droit.

```
            [10]          ← racine
           /    \
        [5]      [15]     ← nœuds internes
       /   \     /   \
     [3]  [7]  [12]  [20]   ← feuilles
```

### Terminologie

| Terme | Définition |
|-------|-----------|
| Racine | Nœud sans parent (le premier) |
| Feuille | Nœud sans enfants |
| Hauteur | Longueur du chemin le plus long racine→feuille |
| Sous-arbre | Arbre enraciné en un nœud quelconque |
| BST | Binary Search Tree : gauche < nœud < droite |

### Définition du nœud

```c
typedef struct Noeud {
    int data;
    struct Noeud *gauche;
    struct Noeud *droite;
} Noeud;
```

### Arbre Binaire de Recherche (ABR / BST)

**Propriété clé** : pour tout nœud N,
- tous les nœuds du sous-arbre gauche ont une valeur **< N**
- tous les nœuds du sous-arbre droit ont une valeur **> N**

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Noeud {
    int data;
    struct Noeud *gauche;
    struct Noeud *droite;
} Noeud;

// ─── Créer un nœud ───
Noeud* creer_noeud(int val) {
    Noeud *n = (Noeud*) malloc(sizeof(Noeud));
    n->data = val;
    n->gauche = NULL;
    n->droite = NULL;
    return n;
}

// ─── Insertion BST ───
Noeud* inserer(Noeud *racine, int val) {
    if (racine == NULL) return creer_noeud(val);
    if (val < racine->data)
        racine->gauche = inserer(racine->gauche, val);
    else if (val > racine->data)
        racine->droite = inserer(racine->droite, val);
    // si val == racine->data : ignorer (pas de doublons)
    return racine;
}

// ─── Recherche ───
int rechercher(Noeud *racine, int val) {
    if (racine == NULL) return 0;         // non trouvé
    if (val == racine->data) return 1;    // trouvé
    if (val < racine->data)
        return rechercher(racine->gauche, val);
    return rechercher(racine->droite, val);
}

// ─── Parcours In-Ordre (gauche, racine, droite) ───
// → donne les valeurs dans l'ordre croissant pour un BST !
void inordre(Noeud *racine) {
    if (racine == NULL) return;
    inordre(racine->gauche);
    printf("%d ", racine->data);
    inordre(racine->droite);
}

// ─── Parcours Pré-Ordre (racine, gauche, droite) ───
void preordre(Noeud *racine) {
    if (racine == NULL) return;
    printf("%d ", racine->data);
    preordre(racine->gauche);
    preordre(racine->droite);
}

// ─── Parcours Post-Ordre (gauche, droite, racine) ───
void postordre(Noeud *racine) {
    if (racine == NULL) return;
    postordre(racine->gauche);
    postordre(racine->droite);
    printf("%d ", racine->data);
}

// ─── Hauteur ───
int hauteur(Noeud *racine) {
    if (racine == NULL) return -1;
    int hg = hauteur(racine->gauche);
    int hd = hauteur(racine->droite);
    return 1 + (hg > hd ? hg : hd);
}

// ─── Libération ───
void liberer(Noeud *racine) {
    if (racine == NULL) return;
    liberer(racine->gauche);
    liberer(racine->droite);
    free(racine);
}

int main() {
    Noeud *racine = NULL;
    int vals[] = {10, 5, 15, 3, 7, 12, 20};
    for (int i = 0; i < 7; i++)
        racine = inserer(racine, vals[i]);

    printf("In-ordre   : "); inordre(racine);   printf("\n"); // 3 5 7 10 12 15 20
    printf("Pré-ordre  : "); preordre(racine);  printf("\n"); // 10 5 3 7 15 12 20
    printf("Post-ordre : "); postordre(racine); printf("\n"); // 3 7 5 12 20 15 10
    printf("Hauteur    : %d\n", hauteur(racine));              // 2
    printf("Recherche 7 : %s\n", rechercher(racine, 7) ? "Trouvé" : "Absent");

    liberer(racine);
    return 0;
}
```

### Suppression dans un BST

```c
// Trouver le minimum d'un sous-arbre (pour suppression)
Noeud* min_noeud(Noeud *n) {
    while (n->gauche != NULL) n = n->gauche;
    return n;
}

Noeud* supprimer_bst(Noeud *racine, int val) {
    if (racine == NULL) return NULL;

    if (val < racine->data)
        racine->gauche = supprimer_bst(racine->gauche, val);
    else if (val > racine->data)
        racine->droite = supprimer_bst(racine->droite, val);
    else {
        // Cas 1 : feuille
        if (racine->gauche == NULL && racine->droite == NULL) {
            free(racine);
            return NULL;
        }
        // Cas 2 : un seul fils
        if (racine->gauche == NULL) {
            Noeud *tmp = racine->droite;
            free(racine);
            return tmp;
        }
        if (racine->droite == NULL) {
            Noeud *tmp = racine->gauche;
            free(racine);
            return tmp;
        }
        // Cas 3 : deux fils → remplacer par le successeur in-ordre
        Noeud *successeur = min_noeud(racine->droite);
        racine->data = successeur->data;
        racine->droite = supprimer_bst(racine->droite, successeur->data);
    }
    return racine;
}
```

---

### Exercice 9.1

Écris une fonction `int compter_feuilles(Noeud *racine)` qui compte le nombre de feuilles dans un arbre binaire.

**Corrigé :**

```c
int compter_feuilles(Noeud *racine) {
    if (racine == NULL) return 0;
    if (racine->gauche == NULL && racine->droite == NULL) return 1; // c'est une feuille
    return compter_feuilles(racine->gauche) + compter_feuilles(racine->droite);
}
// Pour l'arbre ci-dessus : retourne 4 (nœuds 3, 7, 12, 20)
```

---

## 10. EXERCICES FINAUX

Ces exercices sont indépendants des précédents et combinent plusieurs notions.

---

### EXERCICE FINAL A — PILE : Milieu d'un segment

**Énoncé :**

Un segment est défini par deux points A(xa, ya) et B(xb, yb). On dispose d'une pile pouvant stocker au maximum 50 points. Écrire un programme complet avec :
1. La structure `Point` et la structure `Segment`
2. Une pile de segments (max 50)
3. Une fonction `empiler_segment` et `depiler_segment`
4. Une fonction `milieu(Segment s)` qui retourne le point milieu
5. Un `main` qui empile 3 segments, les dépile un à un et affiche leur milieu

**Corrigé :**

```c
#include <stdio.h>
#include <stdlib.h>

#define MAX 50

// ─── Structures ───
typedef struct {
    float x;
    float y;
} Point;

typedef struct {
    Point A;
    Point B;
} Segment;

// ─── Pile de Segments (tableau statique, max 50) ───
typedef struct {
    Segment data[MAX];
    int sommet;  // indice du sommet (-1 = vide)
} PileSegments;

void init_pile(PileSegments *p) {
    p->sommet = -1;
}

int pile_vide(PileSegments *p) {
    return p->sommet == -1;
}

int pile_pleine(PileSegments *p) {
    return p->sommet == MAX - 1;
}

void empiler(PileSegments *p, Segment s) {
    if (pile_pleine(p)) {
        printf("Pile pleine !\n");
        return;
    }
    p->sommet++;
    p->data[p->sommet] = s;
}

Segment depiler(PileSegments *p) {
    if (pile_vide(p)) {
        printf("Pile vide !\n");
        Segment vide = {{0,0},{0,0}};
        return vide;
    }
    Segment s = p->data[p->sommet];
    p->sommet--;
    return s;
}

// ─── Milieu d'un segment ───
// Formule : M = ((xa+xb)/2, (ya+yb)/2)
Point milieu(Segment s) {
    Point m;
    m.x = (s.A.x + s.B.x) / 2.0f;
    m.y = (s.A.y + s.B.y) / 2.0f;
    return m;
}

// ─── Affichage ───
void afficher_segment(Segment s) {
    printf("A(%.1f, %.1f) — B(%.1f, %.1f)", s.A.x, s.A.y, s.B.x, s.B.y);
}

void afficher_point(Point p) {
    printf("(%.1f, %.1f)", p.x, p.y);
}

// ─── Main ───
int main() {
    PileSegments pile;
    init_pile(&pile);

    // Créer 3 segments
    Segment s1 = {{0, 0}, {4, 4}};    // milieu : (2, 2)
    Segment s2 = {{1, 2}, {5, 6}};    // milieu : (3, 4)
    Segment s3 = {{-2, 3}, {4, -1}};  // milieu : (1, 1)

    // Empiler
    empiler(&pile, s1);
    empiler(&pile, s2);
    empiler(&pile, s3);

    printf("=== Dépilage et calcul des milieux ===\n\n");

    // Dépiler et calculer
    while (!pile_vide(&pile)) {
        Segment s = depiler(&pile);
        Point m = milieu(s);
        printf("Segment : ");
        afficher_segment(s);
        printf("\n  → Milieu : ");
        afficher_point(m);
        printf("\n\n");
    }

    return 0;
}
```

**Sortie :**
```
=== Dépilage et calcul des milieux ===

Segment : A(-2.0, 3.0) — B(4.0, -1.0)
  → Milieu : (1.0, 1.0)

Segment : A(1.0, 2.0) — B(5.0, 6.0)
  → Milieu : (3.0, 4.0)

Segment : A(0.0, 0.0) — B(4.0, 4.0)
  → Milieu : (2.0, 2.0)
```

---

### EXERCICE FINAL B — FILE : Milieu d'un segment

**Énoncé identique** mais avec une file (FIFO) au lieu d'une pile.

**Corrigé :**

```c
#include <stdio.h>
#include <stdlib.h>

#define MAX 50

typedef struct { float x, y; } Point;
typedef struct { Point A, B; } Segment;

// ─── File de Segments (tableau circulaire) ───
typedef struct {
    Segment data[MAX];
    int debut;   // indice pour défiler
    int fin;     // indice pour enfiler
    int taille;
} FileSegments;

void init_file(FileSegments *f) {
    f->debut = 0;
    f->fin = 0;
    f->taille = 0;
}

int file_vide(FileSegments *f) { return f->taille == 0; }
int file_pleine(FileSegments *f) { return f->taille == MAX; }

void enfiler(FileSegments *f, Segment s) {
    if (file_pleine(f)) { printf("File pleine!\n"); return; }
    f->data[f->fin] = s;
    f->fin = (f->fin + 1) % MAX;  // circulaire
    f->taille++;
}

Segment defiler(FileSegments *f) {
    if (file_vide(f)) {
        printf("File vide!\n");
        Segment vide = {{0,0},{0,0}};
        return vide;
    }
    Segment s = f->data[f->debut];
    f->debut = (f->debut + 1) % MAX;
    f->taille--;
    return s;
}

Point milieu(Segment s) {
    Point m;
    m.x = (s.A.x + s.B.x) / 2.0f;
    m.y = (s.A.y + s.B.y) / 2.0f;
    return m;
}

int main() {
    FileSegments file;
    init_file(&file);

    Segment s1 = {{0, 0}, {4, 4}};    // milieu : (2, 2)
    Segment s2 = {{1, 2}, {5, 6}};    // milieu : (3, 4)
    Segment s3 = {{-2, 3}, {4, -1}};  // milieu : (1, 1)

    enfiler(&file, s1);
    enfiler(&file, s2);
    enfiler(&file, s3);

    printf("=== Défilage et calcul des milieux ===\n\n");

    while (!file_vide(&file)) {
        Segment s = defiler(&file);
        Point m = milieu(s);
        printf("Segment A(%.1f,%.1f) — B(%.1f,%.1f)  →  Milieu (%.1f, %.1f)\n",
               s.A.x, s.A.y, s.B.x, s.B.y, m.x, m.y);
    }

    return 0;
}
```

**Sortie (ordre FIFO) :**
```
Segment A(0.0,0.0) — B(4.0,4.0)  →  Milieu (2.0, 2.0)
Segment A(1.0,2.0) — B(5.0,6.0)  →  Milieu (3.0, 4.0)
Segment A(-2.0,3.0) — B(4.0,-1.0)  →  Milieu (1.0, 1.0)
```

---

### EXERCICE FINAL C — LISTE CHAÎNÉE : Milieu d'un segment

**Énoncé :** Stocker des segments dans une liste chaînée, parcourir la liste et afficher le milieu de chaque segment. Ajouter aussi une fonction qui trouve le segment le plus long.

**Corrigé :**

```c
#include <stdio.h>
#include <stdlib.h>
#include <math.h>  // pour sqrt

typedef struct { float x, y; } Point;
typedef struct { Point A, B; } Segment;

typedef struct Noeud {
    Segment data;
    struct Noeud *suivant;
} Noeud;

typedef struct {
    Noeud *tete;
    int taille;
} ListeSegments;

void init_liste(ListeSegments *l) {
    l->tete = NULL;
    l->taille = 0;
}

void ajouter_segment(ListeSegments *l, Segment s) {
    Noeud *n = (Noeud*) malloc(sizeof(Noeud));
    n->data = s;
    n->suivant = NULL;

    if (l->tete == NULL) {
        l->tete = n;
    } else {
        Noeud *courant = l->tete;
        while (courant->suivant != NULL)
            courant = courant->suivant;
        courant->suivant = n;
    }
    l->taille++;
}

Point milieu(Segment s) {
    return (Point){ (s.A.x + s.B.x) / 2.0f, (s.A.y + s.B.y) / 2.0f };
}

float longueur_segment(Segment s) {
    float dx = s.B.x - s.A.x;
    float dy = s.B.y - s.A.y;
    return sqrt(dx*dx + dy*dy);
}

void afficher_milieux(ListeSegments *l) {
    Noeud *courant = l->tete;
    int i = 1;
    while (courant != NULL) {
        Segment s = courant->data;
        Point m = milieu(s);
        printf("Segment %d : A(%.1f,%.1f)—B(%.1f,%.1f) → Milieu(%.1f, %.1f)\n",
               i++, s.A.x, s.A.y, s.B.x, s.B.y, m.x, m.y);
        courant = courant->suivant;
    }
}

Segment segment_le_plus_long(ListeSegments *l) {
    Noeud *courant = l->tete;
    Segment plus_long = courant->data;
    float max_len = longueur_segment(plus_long);

    while (courant != NULL) {
        float len = longueur_segment(courant->data);
        if (len > max_len) {
            max_len = len;
            plus_long = courant->data;
        }
        courant = courant->suivant;
    }
    return plus_long;
}

void liberer_liste(ListeSegments *l) {
    Noeud *courant = l->tete;
    while (courant != NULL) {
        Noeud *tmp = courant;
        courant = courant->suivant;
        free(tmp);
    }
    l->tete = NULL;
}

int main() {
    ListeSegments liste;
    init_liste(&liste);

    ajouter_segment(&liste, (Segment){{0,0},{4,4}});
    ajouter_segment(&liste, (Segment){{1,2},{5,6}});
    ajouter_segment(&liste, (Segment){{0,0},{10,0}});

    printf("=== Milieux de tous les segments ===\n");
    afficher_milieux(&liste);

    Segment long_seg = segment_le_plus_long(&liste);
    printf("\nSegment le plus long : A(%.1f,%.1f)—B(%.1f,%.1f), longueur=%.2f\n",
           long_seg.A.x, long_seg.A.y, long_seg.B.x, long_seg.B.y,
           longueur_segment(long_seg));

    liberer_liste(&liste);
    return 0;
}
```

---

### EXERCICE FINAL D — ARBRE BINAIRE : Nombres Complexes

**Énoncé :**

Un nombre complexe z = a + bi est défini par deux réels a (partie réelle) et b (partie imaginaire).  
On crée un **arbre binaire de recherche** où les nœuds stockent des nombres complexes.  
**Critère de tri** : on compare les **modules** |z| = √(a²+b²).

Implémenter :
1. La structure `Complexe` et le nœud d'arbre
2. `inserer_complexe` basé sur le module
3. `afficher_inordre` : affiche les complexes du plus petit au plus grand module
4. `rechercher_module` : recherche si un complexe de module donné existe
5. `module_max` : retourne le complexe de plus grand module (le plus à droite)
6. Un main de démonstration complet

**Corrigé :**

```c
#include <stdio.h>
#include <stdlib.h>
#include <math.h>

// ─── Structure Complexe ───
typedef struct {
    float a;  // partie réelle
    float b;  // partie imaginaire
} Complexe;

// ─── Calcul du module ───
float module(Complexe z) {
    return sqrt(z.a * z.a + z.b * z.b);
}

// ─── Affichage d'un complexe ───
void afficher_complexe(Complexe z) {
    if (z.b >= 0)
        printf("%.2f + %.2fi  (|z|=%.2f)", z.a, z.b, module(z));
    else
        printf("%.2f - %.2fi  (|z|=%.2f)", z.a, -z.b, module(z));
}

// ─── Nœud de l'arbre ───
typedef struct Noeud {
    Complexe data;
    struct Noeud *gauche;
    struct Noeud *droite;
} Noeud;

Noeud* creer_noeud_complexe(Complexe z) {
    Noeud *n = (Noeud*) malloc(sizeof(Noeud));
    n->data = z;
    n->gauche = NULL;
    n->droite = NULL;
    return n;
}

// ─── Insertion : basée sur le module ───
Noeud* inserer(Noeud *racine, Complexe z) {
    if (racine == NULL) return creer_noeud_complexe(z);

    float mod_z   = module(z);
    float mod_rac = module(racine->data);

    if (mod_z < mod_rac)
        racine->gauche = inserer(racine->gauche, z);
    else if (mod_z > mod_rac)
        racine->droite = inserer(racine->droite, z);
    else {
        // modules égaux : on les considère équivalents, pas d'insertion
        printf("Complexe de même module déjà présent, ignoré.\n");
    }
    return racine;
}

// ─── Parcours in-ordre : ordre croissant des modules ───
void inordre(Noeud *racine) {
    if (racine == NULL) return;
    inordre(racine->gauche);
    printf("  ");
    afficher_complexe(racine->data);
    printf("\n");
    inordre(racine->droite);
}

// ─── Recherche par module ───
Noeud* rechercher(Noeud *racine, float mod_cible) {
    if (racine == NULL) return NULL;
    float mod_rac = module(racine->data);

    if (fabs(mod_cible - mod_rac) < 1e-4)  // comparaison flottants
        return racine;
    if (mod_cible < mod_rac)
        return rechercher(racine->gauche, mod_cible);
    return rechercher(racine->droite, mod_cible);
}

// ─── Complexe de module maximal ─── (nœud le plus à droite)
Noeud* module_max(Noeud *racine) {
    if (racine == NULL) return NULL;
    while (racine->droite != NULL)
        racine = racine->droite;
    return racine;
}

// ─── Complexe de module minimal ─── (nœud le plus à gauche)
Noeud* module_min(Noeud *racine) {
    if (racine == NULL) return NULL;
    while (racine->gauche != NULL)
        racine = racine->gauche;
    return racine;
}

// ─── Hauteur ───
int hauteur(Noeud *racine) {
    if (racine == NULL) return -1;
    int hg = hauteur(racine->gauche);
    int hd = hauteur(racine->droite);
    return 1 + (hg > hd ? hg : hd);
}

// ─── Libération ───
void liberer(Noeud *racine) {
    if (racine == NULL) return;
    liberer(racine->gauche);
    liberer(racine->droite);
    free(racine);
}

// ─── Main ───
int main() {
    Noeud *racine = NULL;

    // Insérer des complexes variés
    // z1 = 3 + 4i  → |z1| = 5
    // z2 = 1 + 0i  → |z2| = 1
    // z3 = 0 + 2i  → |z3| = 2
    // z4 = 6 - 8i  → |z4| = 10
    // z5 = 2 + 2i  → |z5| = 2.83
    // z6 = -3 + 0i → |z6| = 3

    Complexe complexes[] = {
        {3, 4}, {1, 0}, {0, 2}, {6, -8}, {2, 2}, {-3, 0}
    };
    int n = 6;

    for (int i = 0; i < n; i++)
        racine = inserer(racine, complexes[i]);

    printf("=== Complexes par ordre croissant de module ===\n");
    inordre(racine);

    printf("\n=== Statistiques ===\n");
    Noeud *max = module_max(racine);
    Noeud *min = module_min(racine);
    printf("Module max : "); afficher_complexe(max->data); printf("\n");
    printf("Module min : "); afficher_complexe(min->data); printf("\n");
    printf("Hauteur de l'arbre : %d\n", hauteur(racine));

    printf("\n=== Recherche du complexe de module 5 ===\n");
    Noeud *trouve = rechercher(racine, 5.0f);
    if (trouve) {
        printf("Trouvé : "); afficher_complexe(trouve->data); printf("\n");
    } else {
        printf("Aucun complexe de module 5 trouvé.\n");
    }

    printf("\n=== Recherche du complexe de module 7 ===\n");
    Noeud *absent = rechercher(racine, 7.0f);
    if (absent)
        printf("Trouvé.\n");
    else
        printf("Aucun complexe de module 7 trouvé.\n");

    liberer(racine);
    return 0;
}
```

**Sortie :**
```
=== Complexes par ordre croissant de module ===
  1.00 + 0.00i   (|z|=1.00)
  0.00 + 2.00i   (|z|=2.00)
  2.00 + 2.00i   (|z|=2.83)
  -3.00 - 0.00i  (|z|=3.00)
  3.00 + 4.00i   (|z|=5.00)
  6.00 - 8.00i   (|z|=10.00)

=== Statistiques ===
Module max : 6.00 - 8.00i  (|z|=10.00)
Module min : 1.00 + 0.00i  (|z|=1.00)
Hauteur de l'arbre : 4

=== Recherche du complexe de module 5 ===
Trouvé : 3.00 + 4.00i  (|z|=5.00)

=== Recherche du complexe de module 7 ===
Aucun complexe de module 7 trouvé.
```

---

## RÉCAPITULATIF GÉNÉRAL
----------------------------------------------------------------------------------------------------------------------
| Structure         | Organisation | Accès        | Insertion    | Suppression  | Usage                              |
|-------------------|--------------|--------------|--------------|--------------|------------------------------------|
| Tableau dynamique | Contigu      | O(1)         | O(n)         | O(n)         | Accès rapide par index             |
| Liste chaînée     | Chaîné       | O(n)         | O(1) tête    | O(1) tête    | Insertions/suppressions fréquentes |
| Pile (LIFO)       | Sommet       | O(1) sommet  | O(1)         | O(1)         | Annulation, récursion, parsing     |
| File (FIFO)       | Tête/Queue   | O(1) tête    | O(1) queue   | O(1) tête    | Files d'attente, BFS               |
| Arbre BST         | Hiérarchique | O(log n) moy | O(log n) moy | O(log n) moy | Recherche rapide, tri              |
----------------------------------------------------------------------------------------------------------------------
---

## CHECKLIST 

- [ ] Je sais déclarer et utiliser un pointeur (`*p`, `&x`, `*p = val`)
- [ ] Je comprends pourquoi on passe `**` pour modifier un pointeur dans une fonction
- [ ] Je sais faire `malloc`, vérifier `NULL`, et `free`
- [ ] Je sais la différence entre `malloc` (non initialisé) et `calloc` (initialisé à 0)
- [ ] Je sais implémenter une liste chaînée (insertion tête/queue, suppression)
- [ ] Je sais implémenter une pile (push/pop) et une file (enfiler/défiler)
- [ ] Je sais faire les 3 parcours d'un arbre (in-ordre, pré-ordre, post-ordre)
- [ ] Je sais insérer dans un BST de manière récursive
- [ ] Je n'oublie jamais de `free` ce que j'ai `malloc`é

---
